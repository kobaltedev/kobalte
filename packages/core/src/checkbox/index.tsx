import {
	type CheckboxControlCommonProps,
	type CheckboxControlOptions,
	type CheckboxControlProps,
	type CheckboxControlRenderProps,
	CheckboxControl as Control,
} from "./checkbox-control";
import {
	type CheckboxDescriptionCommonProps,
	type CheckboxDescriptionOptions,
	type CheckboxDescriptionProps,
	type CheckboxDescriptionRenderProps,
	CheckboxDescription as Description,
} from "./checkbox-description";
import {
	type CheckboxErrorMessageCommonProps,
	type CheckboxErrorMessageOptions,
	type CheckboxErrorMessageProps,
	type CheckboxErrorMessageRenderProps,
	CheckboxErrorMessage as ErrorMessage,
} from "./checkbox-error-message";
import {
	type CheckboxIndicatorCommonProps,
	type CheckboxIndicatorOptions,
	type CheckboxIndicatorProps,
	type CheckboxIndicatorRenderProps,
	CheckboxIndicator as Indicator,
} from "./checkbox-indicator";
import {
	type CheckboxInputCommonProps,
	type CheckboxInputOptions,
	type CheckboxInputProps,
	type CheckboxInputRenderProps,
	CheckboxInput as Input,
} from "./checkbox-input";
import {
	type CheckboxLabelCommonProps,
	type CheckboxLabelOptions,
	type CheckboxLabelProps,
	type CheckboxLabelRenderProps,
	CheckboxLabel as Label,
} from "./checkbox-label";
import {
	type CheckboxRootCommonProps,
	type CheckboxRootOptions,
	type CheckboxRootProps,
	type CheckboxRootRenderProps,
	CheckboxRoot as Root,
} from "./checkbox-root";

export type {
	CheckboxControlOptions,
	CheckboxControlCommonProps,
	CheckboxControlRenderProps,
	CheckboxControlProps,
	CheckboxDescriptionOptions,
	CheckboxDescriptionCommonProps,
	CheckboxDescriptionRenderProps,
	CheckboxDescriptionProps,
	CheckboxErrorMessageOptions,
	CheckboxErrorMessageCommonProps,
	CheckboxErrorMessageRenderProps,
	CheckboxErrorMessageProps,
	CheckboxIndicatorOptions,
	CheckboxIndicatorCommonProps,
	CheckboxIndicatorRenderProps,
	CheckboxIndicatorProps,
	CheckboxInputOptions,
	CheckboxInputCommonProps,
	CheckboxInputRenderProps,
	CheckboxInputProps,
	CheckboxLabelOptions,
	CheckboxLabelCommonProps,
	CheckboxLabelRenderProps,
	CheckboxLabelProps,
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
	useCheckboxContext,
	type CheckboxContextValue,
} from "./checkbox-context";
