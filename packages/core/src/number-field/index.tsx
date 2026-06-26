import {
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	FormControlLabel as Label,
	type FormControlDescriptionCommonProps as NumberFieldDescriptionCommonProps,
	type FormControlDescriptionOptions as NumberFieldDescriptionOptions,
	type FormControlDescriptionProps as NumberFieldDescriptionProps,
	type FormControlDescriptionRenderProps as NumberFieldDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as NumberFieldErrorMessageCommonProps,
	type FormControlErrorMessageOptions as NumberFieldErrorMessageOptions,
	type FormControlErrorMessageProps as NumberFieldErrorMessageProps,
	type FormControlErrorMessageRenderProps as NumberFieldErrorMessageRenderProps,
	type FormControlLabelCommonProps as NumberFieldLabelCommonProps,
	type FormControlLabelOptions as NumberFieldLabelOptions,
	type FormControlLabelProps as NumberFieldLabelProps,
	type FormControlLabelRenderProps as NumberFieldLabelRenderProps,
} from "../form-control";
import {
	NumberFieldDecrementTrigger as DecrementTrigger,
	type NumberFieldDecrementTriggerCommonProps,
	type NumberFieldDecrementTriggerOptions,
	type NumberFieldDecrementTriggerProps,
	type NumberFieldDecrementTriggerRenderProps,
} from "./number-field-decrement-trigger";
import {
	NumberFieldHiddenInput as HiddenInput,
	type NumberFieldHiddenInputProps,
} from "./number-field-hidden-input";
import {
	NumberFieldIncrementTrigger as IncrementTrigger,
	type NumberFieldIncrementTriggerCommonProps,
	type NumberFieldIncrementTriggerOptions,
	type NumberFieldIncrementTriggerProps,
	type NumberFieldIncrementTriggerRenderProps,
} from "./number-field-increment-trigger";
import {
	NumberFieldInput as Input,
	type NumberFieldInputCommonProps,
	type NumberFieldInputOptions,
	type NumberFieldInputProps,
	type NumberFieldInputRenderProps,
} from "./number-field-input";
import {
	type NumberFieldRootCommonProps,
	type NumberFieldRootOptions,
	type NumberFieldRootProps,
	type NumberFieldRootRenderProps,
	NumberFieldRoot as Root,
} from "./number-field-root";

export type {
	NumberFieldDecrementTriggerCommonProps,
	NumberFieldDecrementTriggerOptions,
	NumberFieldDecrementTriggerProps,
	NumberFieldDecrementTriggerRenderProps,
	NumberFieldDescriptionCommonProps,
	NumberFieldDescriptionOptions,
	NumberFieldDescriptionProps,
	NumberFieldDescriptionRenderProps,
	NumberFieldErrorMessageCommonProps,
	NumberFieldErrorMessageOptions,
	NumberFieldErrorMessageProps,
	NumberFieldErrorMessageRenderProps,
	NumberFieldHiddenInputProps,
	NumberFieldIncrementTriggerCommonProps,
	NumberFieldIncrementTriggerOptions,
	NumberFieldIncrementTriggerProps,
	NumberFieldIncrementTriggerRenderProps,
	NumberFieldInputCommonProps,
	NumberFieldInputOptions,
	NumberFieldInputProps,
	NumberFieldInputRenderProps,
	NumberFieldLabelCommonProps,
	NumberFieldLabelOptions,
	NumberFieldLabelProps,
	NumberFieldLabelRenderProps,
	NumberFieldRootCommonProps,
	NumberFieldRootOptions,
	NumberFieldRootProps,
	NumberFieldRootRenderProps,
};
export {
	DecrementTrigger,
	Description,
	ErrorMessage,
	HiddenInput,
	IncrementTrigger,
	Input,
	Label,
	Root,
};

export const NumberField = Object.assign(Root, {
	Description,
	ErrorMessage,
	HiddenInput,
	Input,
	IncrementTrigger,
	DecrementTrigger,
	Label,
});

/**
 * API will most probably change
 */
export {
	type NumberFieldContextValue,
	useNumberFieldContext,
} from "./number-field-context";
