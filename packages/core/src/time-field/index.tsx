import {
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	type FormControlDescriptionCommonProps as TimeFieldDescriptionCommonProps,
	type FormControlDescriptionOptions as TimeFieldDescriptionOptions,
	type FormControlDescriptionProps as TimeFieldDescriptionProps,
	type FormControlDescriptionRenderProps as TimeFieldDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as TimeFieldErrorMessageCommonProps,
	type FormControlErrorMessageOptions as TimeFieldErrorMessageOptions,
	type FormControlErrorMessageProps as TimeFieldErrorMessageProps,
	type FormControlErrorMessageRenderProps as TimeFieldErrorMessageRenderProps,
} from "../form-control";
import {
	TimeFieldHiddenInput as HiddenInput,
	type TimeFieldHiddenInputProps,
} from "./time-field-hidden-input";
import {
	TimeFieldInput as Input,
	type TimeFieldInputCommonProps,
	type TimeFieldInputOptions,
	type TimeFieldInputProps,
	type TimeFieldInputRenderProps,
} from "./time-field-input";
import {
	TimeFieldLabel as Label,
	type TimeFieldLabelCommonProps,
	type TimeFieldLabelOptions,
	type TimeFieldLabelProps,
	type TimeFieldLabelRenderProps,
} from "./time-field-label";
import {
	TimeFieldRoot as Root,
	type TimeFieldRootCommonProps,
	type TimeFieldRootOptions,
	type TimeFieldRootProps,
	type TimeFieldRootRenderProps,
} from "./time-field-root";
import {
	TimeFieldSegment as Segment,
	type TimeFieldSegmentCommonProps,
	type TimeFieldSegmentOptions,
	type TimeFieldSegmentProps,
	type TimeFieldSegmentRenderProps,
} from "./time-field-segment";

export type {
	TimeFieldDescriptionCommonProps,
	TimeFieldDescriptionOptions,
	TimeFieldDescriptionProps,
	TimeFieldDescriptionRenderProps,
	TimeFieldErrorMessageCommonProps,
	TimeFieldErrorMessageOptions,
	TimeFieldErrorMessageProps,
	TimeFieldErrorMessageRenderProps,
	TimeFieldHiddenInputProps,
	TimeFieldInputOptions,
	TimeFieldInputCommonProps,
	TimeFieldInputRenderProps,
	TimeFieldInputProps,
	TimeFieldLabelCommonProps,
	TimeFieldLabelOptions,
	TimeFieldLabelProps,
	TimeFieldLabelRenderProps,
	TimeFieldRootCommonProps,
	TimeFieldRootOptions,
	TimeFieldRootProps,
	TimeFieldRootRenderProps,
	TimeFieldSegmentCommonProps,
	TimeFieldSegmentOptions,
	TimeFieldSegmentProps,
	TimeFieldSegmentRenderProps,
};

export { Description, ErrorMessage, HiddenInput, Input, Label, Root, Segment };

export const TimeField = Object.assign(Root, {
	Label,
	Input,
	Segment,
	Description,
	ErrorMessage,
	HiddenInput,
});
