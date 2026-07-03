import {
	callHandler,
	mergeDefaultProps,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { ComponentProps, JSX } from "@solidjs/web";
import { omit } from "solid-js";
import {
	createFormControlField,
	FORM_CONTROL_FIELD_PROP_NAMES,
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

	const formControlFieldProps = omit(mergedProps, "style", "onChange");
	const others = omit(
		mergedProps,
		"style",
		"onChange",
		...FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps as any);

	const onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
		e,
	) => {
		callHandler(
			e as Event & { currentTarget: HTMLInputElement; target: Element },
			mergedProps.onChange as
				| JSX.EventHandlerUnion<HTMLInputElement, Event>
				| undefined,
		);

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
			tabindex={context.state.isDisabled() ? undefined : -1}
			min={context.state.minValue()}
			max={context.state.maxValue()}
			step={context.state.step()}
			value={context.state.hue()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={combineStyle({ ...visuallyHiddenStyles }, mergedProps.style)}
			aria-valuetext={context.getThumbValueLabel()}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" ? "true" : undefined
			}
			aria-required={formControlContext.isRequired() ? "true" : undefined}
			aria-disabled={formControlContext.isDisabled() ? "true" : undefined}
			aria-readonly={formControlContext.isReadOnly() ? "true" : undefined}
			onChange={onChange}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
