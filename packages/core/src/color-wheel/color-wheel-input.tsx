import {
	callHandler,
	mergeDefaultProps,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { type ComponentProps, type JSX, splitProps } from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import { useColorWheelContext } from "./color-wheel-context";

export interface ColorWheelInputProps extends ComponentProps<"input"> {
	style?: JSX.CSSProperties | string;
}

export function ColorWheelInput(props: ColorWheelInputProps) {
	const formControlContext = useFormControlContext();
	const context = useColorWheelContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("input"),
		},
		props,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["style", "onChange"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
		e,
	) => {
		callHandler(e, local.onChange);

		const target = e.target as HTMLInputElement;

		context.state.setHue(Number.parseFloat(target.value));

		// Unlike in React, inputs `value` can be out of sync with our value state.
		// even if an input is controlled (ex: `<input value="foo" />`,
		// typing on the input will change its internal `value`.

		// To prevent this, we need to force the input `value` to be in sync with the slider value state.
		target.value = String(context.state.hue()) ?? "";
	};

	return (
		<input
			type="range"
			id={fieldProps.id()}
			name={formControlContext.name()}
			tabIndex={context.state.isDisabled() ? undefined : -1}
			min={context.state.minValue()}
			max={context.state.maxValue()}
			step={context.state.step()}
			value={context.state.hue()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={combineStyle({ ...visuallyHiddenStyles }, local.style)}
			aria-valuetext={context.getThumbValueLabel()}
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
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
