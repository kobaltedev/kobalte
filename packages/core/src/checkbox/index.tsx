import {
	CheckboxControl as Control,
	type CheckboxControlCommonProps,
	type CheckboxControlOptions,
	type CheckboxControlProps,
	type CheckboxControlRenderProps,
} from "./checkbox-control";
import {
	CheckboxDescription as Description,
	type CheckboxDescriptionCommonProps,
	type CheckboxDescriptionOptions,
	type CheckboxDescriptionProps,
	type CheckboxDescriptionRenderProps,
} from "./checkbox-description";
import {
	CheckboxErrorMessage as ErrorMessage,
	type CheckboxErrorMessageCommonProps,
	type CheckboxErrorMessageOptions,
	type CheckboxErrorMessageProps,
	type CheckboxErrorMessageRenderProps,
} from "./checkbox-error-message";
import {
	CheckboxIndicator as Indicator,
	type CheckboxIndicatorCommonProps,
	type CheckboxIndicatorOptions,
	type CheckboxIndicatorProps,
	type CheckboxIndicatorRenderProps,
} from "./checkbox-indicator";
import {
	CheckboxInput as Input,
	type CheckboxInputCommonProps,
	type CheckboxInputOptions,
	type CheckboxInputProps,
	type CheckboxInputRenderProps,
} from "./checkbox-input";
import {
	CheckboxLabel as Label,
	type CheckboxLabelCommonProps,
	type CheckboxLabelOptions,
	type CheckboxLabelProps,
	type CheckboxLabelRenderProps,
} from "./checkbox-label";
import {
	CheckboxRoot as Root,
	type CheckboxRootCommonProps,
	type CheckboxRootOptions,
	type CheckboxRootProps,
	type CheckboxRootRenderProps,
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
