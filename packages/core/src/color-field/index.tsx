import {
	type FormControlDescriptionCommonProps as ColorFieldDescriptionCommonProps,
	type FormControlDescriptionOptions as ColorFieldDescriptionOptions,
	type FormControlDescriptionProps as ColorFieldDescriptionProps,
	type FormControlDescriptionRenderProps as ColorFieldDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as ColorFieldErrorMessageCommonProps,
	type FormControlErrorMessageOptions as ColorFieldErrorMessageOptions,
	type FormControlErrorMessageProps as ColorFieldErrorMessageProps,
	type FormControlErrorMessageRenderProps as ColorFieldErrorMessageRenderProps,
	type FormControlLabelCommonProps as ColorFieldLabelCommonProps,
	type FormControlLabelOptions as ColorFieldLabelOptions,
	type FormControlLabelProps as ColorFieldLabelProps,
	type FormControlLabelRenderProps as ColorFieldLabelRenderProps,
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	FormControlLabel as Label,
} from "../form-control";
import {
	type ColorFieldInputCommonProps,
	type ColorFieldInputOptions,
	type ColorFieldInputProps,
	type ColorFieldInputRenderProps,
	ColorFieldInput as Input,
} from "./color-field-input";
import {
	type ColorFieldRootCommonProps,
	type ColorFieldRootOptions,
	type ColorFieldRootProps,
	type ColorFieldRootRenderProps,
	ColorFieldRoot as Root,
} from "./color-field-root";

export type {
	ColorFieldDescriptionOptions,
	ColorFieldDescriptionCommonProps,
	ColorFieldDescriptionRenderProps,
	ColorFieldDescriptionProps,
	ColorFieldErrorMessageOptions,
	ColorFieldErrorMessageCommonProps,
	ColorFieldErrorMessageRenderProps,
	ColorFieldErrorMessageProps,
	ColorFieldInputOptions,
	ColorFieldInputCommonProps,
	ColorFieldInputRenderProps,
	ColorFieldInputProps,
	ColorFieldLabelOptions,
	ColorFieldLabelCommonProps,
	ColorFieldLabelRenderProps,
	ColorFieldLabelProps,
	ColorFieldRootOptions,
	ColorFieldRootCommonProps,
	ColorFieldRootRenderProps,
	ColorFieldRootProps,
};
export { Description, ErrorMessage, Input, Label, Root };

export const ColorField = Object.assign(Root, {
	Description,
	ErrorMessage,
	Input,
	Label,
});

/**
 * API will most probably change
 */
export {
	useColorFieldContext,
	type ColorFieldContextValue,
} from "./color-field-context";
