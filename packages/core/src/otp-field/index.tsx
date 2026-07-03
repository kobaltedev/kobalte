import {
	OTPFieldDescription as Description,
	type OTPFieldDescriptionCommonProps,
	type OTPFieldDescriptionOptions,
	type OTPFieldDescriptionProps,
	type OTPFieldDescriptionRenderProps,
} from "./otp-field-description";
import {
	OTPFieldErrorMessage as ErrorMessage,
	type OTPFieldErrorMessageCommonProps,
	type OTPFieldErrorMessageOptions,
	type OTPFieldErrorMessageProps,
	type OTPFieldErrorMessageRenderProps,
} from "./otp-field-error-message";
import {
	OTPFieldInput as Input,
	type OTPFieldInputCommonProps,
	type OTPFieldInputOptions,
	type OTPFieldInputProps,
	type OTPFieldInputRenderProps,
} from "./otp-field-input";
import {
	OTPFieldLabel as Label,
	type OTPFieldLabelCommonProps,
	type OTPFieldLabelOptions,
	type OTPFieldLabelProps,
	type OTPFieldLabelRenderProps,
} from "./otp-field-label";
import {
	type OTPFieldRootCommonProps,
	type OTPFieldRootOptions,
	type OTPFieldRootProps,
	type OTPFieldRootRenderProps,
	OTPFieldRoot as Root,
} from "./otp-field-root";

export type {
	OTPFieldDescriptionCommonProps,
	OTPFieldDescriptionOptions,
	OTPFieldDescriptionProps,
	OTPFieldDescriptionRenderProps,
	OTPFieldErrorMessageCommonProps,
	OTPFieldErrorMessageOptions,
	OTPFieldErrorMessageProps,
	OTPFieldErrorMessageRenderProps,
	OTPFieldInputCommonProps,
	OTPFieldInputOptions,
	OTPFieldInputProps,
	OTPFieldInputRenderProps,
	OTPFieldLabelCommonProps,
	OTPFieldLabelOptions,
	OTPFieldLabelProps,
	OTPFieldLabelRenderProps,
	OTPFieldRootCommonProps,
	OTPFieldRootOptions,
	OTPFieldRootProps,
	OTPFieldRootRenderProps,
};

export { Description, ErrorMessage, Input, Label, Root };

export const OTPField = Object.assign(Root, {
	Description,
	ErrorMessage,
	Input,
	Label,
});

export {
	type OTPFieldContextValue,
	useOTPFieldContext,
} from "./otp-field-context";
