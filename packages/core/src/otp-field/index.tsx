import {
	OTPFieldDescription as Description,
	type OTPFieldDescriptionCommonProps,
	type OTPFieldDescriptionOptions,
	type OTPFieldDescriptionProps,
	type OTPFieldDescriptionRenderProps,
} from "./otp-field-description.tsx";
import {
	OTPFieldErrorMessage as ErrorMessage,
	type OTPFieldErrorMessageCommonProps,
	type OTPFieldErrorMessageOptions,
	type OTPFieldErrorMessageProps,
	type OTPFieldErrorMessageRenderProps,
} from "./otp-field-error-message.tsx";
import {
	OTPFieldInput as Input,
	type OTPFieldInputCommonProps,
	type OTPFieldInputOptions,
	type OTPFieldInputProps,
	type OTPFieldInputRenderProps,
} from "./otp-field-input.tsx";
import {
	OTPFieldLabel as Label,
	type OTPFieldLabelCommonProps,
	type OTPFieldLabelOptions,
	type OTPFieldLabelProps,
	type OTPFieldLabelRenderProps,
} from "./otp-field-label.tsx";
import {
	type OTPFieldRootCommonProps,
	type OTPFieldRootOptions,
	type OTPFieldRootProps,
	type OTPFieldRootRenderProps,
	OTPFieldRoot as Root,
} from "./otp-field-root.tsx";

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
} from "./otp-field-context.tsx";
