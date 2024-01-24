import {
	OverrideComponentProps,
	callHandler,
	mergeDefaultProps,
	mergeRefs,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { JSX, createEffect, createSignal, on, splitProps } from "solid-js";

import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import { AsChildProp } from "../polymorphic";
import { useSliderContext } from "./slider-context";
import { useThumbContext } from "./slider-thumb";

export interface SliderInputProps
	extends OverrideComponentProps<"input", AsChildProp> {
	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
}

/**
 * The native html input that is visually hidden in the slider thumb.
 */
export function SliderInput(props: SliderInputProps) {
	let ref: HTMLInputElement | undefined;

	const formControlContext = useFormControlContext();
	const context = useSliderContext();
	const thumb = useThumbContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("input"),
		},
		props,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["ref", "style", "onChange"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const [valueText, setValueText] = createSignal("");

	const onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
		e,
	) => {
		callHandler(e, local.onChange);

		const target = e.target as HTMLInputElement;

		context.state.setThumbValue(thumb.index(), parseFloat(target.value));

		// Unlike in React, inputs `value` can be out of sync with our value state.
		// even if an input is controlled (ex: `<input value="foo" />`,
		// typing on the input will change its internal `value`.
		//
		// To prevent this, we need to force the input `value` to be in sync with the slider value state.
		target.value = String(context.state.values()[thumb.index()]) ?? "";
	};

	createEffect(() => {
		setValueText(
			thumb.index() === -1
				? ""
				: context.state.getThumbValueLabel(thumb.index()),
		);
	});

	return (
		<input
			ref={mergeRefs((el) => (ref = el), local.ref)}
			type="range"
			id={fieldProps.id()}
			name={formControlContext.name()}
			tabIndex={context.state.isDisabled() ? undefined : -1}
			min={context.state.getThumbMinValue(thumb.index())}
			max={context.state.getThumbMaxValue(thumb.index())}
			step={context.state.step()}
			value={context.state.values()[thumb.index()]}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={{ ...visuallyHiddenStyles, ...local.style }}
			aria-orientation={context.state.orientation()}
			aria-valuetext={valueText()}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" || undefined
			}
			aria-required={formControlContext.isRequired() || undefined}
			aria-disabled={formControlContext.isDisabled() || undefined}
			aria-readonly={formControlContext.isReadOnly() || undefined}
			onChange={onChange}
			{...context.dataset()}
			{...others}
		/>
	);
}
