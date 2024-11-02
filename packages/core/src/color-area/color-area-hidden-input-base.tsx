import {
	callHandler,
	mergeDefaultProps,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type ComponentProps,
	type JSX,
	createMemo,
	splitProps,
} from "solid-js";
import { COLOR_INTL_TRANSLATIONS } from "../colors";
import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import { useColorAreaContext } from "./color-area-context";

export interface ColorAreaHiddenInputBaseProps extends ComponentProps<"input"> {
	style?: JSX.CSSProperties | string;

	/**
	 * The orientation of the hidden input.
	 * @default horizontal
	 */
	orientation?: "horizontal" | "vertical";
}

export function ColorAreaHiddenInputBase(props: ColorAreaHiddenInputBaseProps) {
	const formControlContext = useFormControlContext();
	const context = useColorAreaContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("input"),
			orientation: "horizontal",
		},
		props,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["style", "orientation", "onChange", "onFocus", "onBlur"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const isVertical = () => local.orientation === "vertical";

	const ariaLabel = () => {
		return [fieldProps.ariaLabel(), context.translations().colorPicker]
			.filter(Boolean)
			.join(", ");
	};

	const onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
		e,
	) => {
		callHandler(e, local.onChange);
		const target = e.target as HTMLInputElement;

		isVertical()
			? context.state.setYValue(Number.parseFloat(target.value))
			: context.state.setXValue(Number.parseFloat(target.value));

		// Unlike in React, inputs `value` can be out of sync with our value state.
		// even if an input is controlled (ex: `<input value="foo" />`,
		// typing on the input will change its internal `value`.
		//
		// To prevent this, we need to force the input `value` to be in sync with the slider value state.
		target.value =
			String(isVertical() ? context.state.yValue() : context.state.xValue()) ??
			"";
	};

	const valueText = createMemo(() => {
		const channel = isVertical()
			? context.state.channels().yChannel
			: context.state.channels().xChannel;
		return `${context.state.value().getChannelName(channel, COLOR_INTL_TRANSLATIONS)} ${context.state.value().formatChannelValue(channel)}, ${context.state.value().getColorName(COLOR_INTL_TRANSLATIONS)}`;
	});

	return (
		<input
			type="range"
			id={fieldProps.id()}
			name={
				(isVertical() ? context.yName() : context.xName()) ||
				formControlContext.name()
			}
			tabIndex={context.state.isDisabled() ? undefined : -1}
			min={isVertical() ? context.state.yMinValue() : context.state.xMinValue()}
			max={isVertical() ? context.state.yMaxValue() : context.state.xMaxValue()}
			step={isVertical() ? context.state.yStep() : context.state.xStep()}
			value={isVertical() ? context.state.yValue() : context.state.xValue()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={combineStyle({ ...visuallyHiddenStyles }, local.style)}
			aria-roledescription={context.translations().twoDimensionalSlider}
			aria-valuetext={valueText()}
			aria-orientation={local.orientation}
			aria-label={ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" || undefined
			}
			aria-required={formControlContext.isRequired() || undefined}
			aria-disabled={formControlContext.isDisabled() || undefined}
			aria-readonly={formControlContext.isReadOnly() || undefined}
			data-orientation={local.orientation}
			onChange={onChange}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
