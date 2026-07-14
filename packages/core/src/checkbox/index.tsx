import {
	type CheckboxControlCommonProps,
	type CheckboxControlOptions,
	type CheckboxControlProps,
	type CheckboxControlRenderProps,
	CheckboxControl as Control,
} from "./checkbox-control.tsx";
import {
	type CheckboxDescriptionCommonProps,
	type CheckboxDescriptionOptions,
	type CheckboxDescriptionProps,
	type CheckboxDescriptionRenderProps,
	CheckboxDescription as Description,
} from "./checkbox-description.tsx";
import {
	type CheckboxErrorMessageCommonProps,
	type CheckboxErrorMessageOptions,
	type CheckboxErrorMessageProps,
	type CheckboxErrorMessageRenderProps,
	CheckboxErrorMessage as ErrorMessage,
} from "./checkbox-error-message.tsx";
import {
	type CheckboxIndicatorCommonProps,
	type CheckboxIndicatorOptions,
	type CheckboxIndicatorProps,
	type CheckboxIndicatorRenderProps,
	CheckboxIndicator as Indicator,
} from "./checkbox-indicator.tsx";
import {
	type CheckboxInputCommonProps,
	type CheckboxInputOptions,
	type CheckboxInputProps,
	type CheckboxInputRenderProps,
	CheckboxInput as Input,
} from "./checkbox-input.tsx";
import {
	type CheckboxLabelCommonProps,
	type CheckboxLabelOptions,
	type CheckboxLabelProps,
	type CheckboxLabelRenderProps,
	CheckboxLabel as Label,
} from "./checkbox-label.tsx";
import {
	type CheckboxRootCommonProps,
	type CheckboxRootOptions,
	type CheckboxRootProps,
	type CheckboxRootRenderProps,
	CheckboxRoot as Root,
} from "./checkbox-root.tsx";

export type {
	CheckboxControlCommonProps,
	CheckboxControlOptions,
	CheckboxControlProps,
	CheckboxControlRenderProps,
	CheckboxDescriptionCommonProps,
	CheckboxDescriptionOptions,
	CheckboxDescriptionProps,
	CheckboxDescriptionRenderProps,
	CheckboxErrorMessageCommonProps,
	CheckboxErrorMessageOptions,
	CheckboxErrorMessageProps,
	CheckboxErrorMessageRenderProps,
	CheckboxIndicatorCommonProps,
	CheckboxIndicatorOptions,
	CheckboxIndicatorProps,
	CheckboxIndicatorRenderProps,
	CheckboxInputCommonProps,
	CheckboxInputOptions,
	CheckboxInputProps,
	CheckboxInputRenderProps,
	CheckboxLabelCommonProps,
	CheckboxLabelOptions,
	CheckboxLabelProps,
	CheckboxLabelRenderProps,
	CheckboxRootOptions,
	CheckboxRootProps,
};
export { Control, Description, ErrorMessage, Indicator, Input, Label, Root };

export const Checkbox = Object.assign(Root, {
	Control,
	Description,
	ErrorMessage,
	Indicator,
	Input,
	Label,
});

/**
 * API will most probably change
 */
export {
	type CheckboxContextValue,
	useCheckboxContext,
} from "./checkbox-context.tsx";
