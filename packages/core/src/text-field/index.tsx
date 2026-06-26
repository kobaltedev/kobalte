import {
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	FormControlLabel as Label,
	type FormControlDescriptionCommonProps as TextFieldDescriptionCommonProps,
	type FormControlDescriptionOptions as TextFieldDescriptionOptions,
	type FormControlDescriptionProps as TextFieldDescriptionProps,
	type FormControlDescriptionRenderProps as TextFieldDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as TextFieldErrorMessageCommonProps,
	type FormControlErrorMessageOptions as TextFieldErrorMessageOptions,
	type FormControlErrorMessageProps as TextFieldErrorMessageProps,
	type FormControlErrorMessageRenderProps as TextFieldErrorMessageRenderProps,
	type FormControlLabelCommonProps as TextFieldLabelCommonProps,
	type FormControlLabelOptions as TextFieldLabelOptions,
	type FormControlLabelProps as TextFieldLabelProps,
	type FormControlLabelRenderProps as TextFieldLabelRenderProps,
} from "../form-control";
import {
	TextFieldInput as Input,
	type TextFieldInputCommonProps,
	type TextFieldInputOptions,
	type TextFieldInputProps,
	type TextFieldInputRenderProps,
} from "./text-field-input";
import {
	TextFieldRoot as Root,
	type TextFieldRootCommonProps,
	type TextFieldRootOptions,
	type TextFieldRootProps,
	type TextFieldRootRenderProps,
} from "./text-field-root";
import {
	TextFieldTextArea as TextArea,
	type TextFieldTextAreaCommonProps,
	type TextFieldTextAreaOptions,
	type TextFieldTextAreaProps,
	type TextFieldTextAreaRenderProps,
} from "./text-field-text-area";

export type {
	TextFieldDescriptionCommonProps,
	TextFieldDescriptionOptions,
	TextFieldDescriptionProps,
	TextFieldDescriptionRenderProps,
	TextFieldErrorMessageCommonProps,
	TextFieldErrorMessageOptions,
	TextFieldErrorMessageProps,
	TextFieldErrorMessageRenderProps,
	TextFieldInputCommonProps,
	TextFieldInputOptions,
	TextFieldInputProps,
	TextFieldInputRenderProps,
	TextFieldLabelCommonProps,
	TextFieldLabelOptions,
	TextFieldLabelProps,
	TextFieldLabelRenderProps,
	TextFieldRootCommonProps,
	TextFieldRootOptions,
	TextFieldRootProps,
	TextFieldRootRenderProps,
	TextFieldTextAreaCommonProps,
	TextFieldTextAreaOptions,
	TextFieldTextAreaProps,
	TextFieldTextAreaRenderProps,
};
export { Description, ErrorMessage, Input, Label, Root, TextArea };

export const TextField = Object.assign(Root, {
	Description,
	ErrorMessage,
	Input,
	Label,
	TextArea,
});

/**
 * API will most probably change
 */
export {
	type TextFieldContextValue,
	useTextFieldContext,
} from "./text-field-context";
