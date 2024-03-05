import {
	FormControlDescription as Description,
	type FormControlDescriptionProps as NumberFieldDescriptionProps,
	FormControlErrorMessage as ErrorMessage,
	type FormControlErrorMessageOptions as NumberFieldErrorMessageOptions,
	type FormControlErrorMessageProps as NumberFieldErrorMessageProps,
	FormControlLabel as Label,
	type FormControlLabelProps as NumberFieldLabelProps,
} from "../form-control";
import {
	NumberFieldDecrementTrigger as DecrementTrigger,
	type NumberFieldDecrementTriggerProps,
} from "./number-field-decrement-trigger";
import {
	NumberFieldHiddenInput as HiddenInput,
	type NumberFieldHiddenInputProps,
} from "./number-field-hidden-input";
import {
	NumberFieldIncrementTrigger as IncrementTrigger,
	type NumberFieldIncrementTriggerProps,
} from "./number-field-increment-trigger";
import {
	NumberFieldInput as Input,
	type NumberFieldInputProps,
} from "./number-field-input";
import {
	NumberFieldRoot as Root,
	type NumberFieldRootOptions,
	type NumberFieldRootProps,
} from "./number-field-root";

export type {
	NumberFieldDescriptionProps,
	NumberFieldErrorMessageOptions,
	NumberFieldErrorMessageProps,
	NumberFieldInputProps,
	NumberFieldLabelProps,
	NumberFieldRootOptions,
	NumberFieldRootProps,
	NumberFieldHiddenInputProps,
	NumberFieldIncrementTriggerProps,
	NumberFieldDecrementTriggerProps,
};
export {
	Description,
	ErrorMessage,
	HiddenInput,
	Input,
	IncrementTrigger,
	DecrementTrigger,
	Label,
	Root,
};
