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
	TimeFieldField as Field,
	type TimeFieldFieldCommonProps,
	type TimeFieldFieldOptions,
	type TimeFieldFieldProps,
	type TimeFieldFieldRenderProps,
} from "./time-field-field";
import {
	TimeFieldHiddenInput as HiddenInput,
	type TimeFieldHiddenInputProps,
} from "./time-field-hidden-input";
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
	TimeFieldHiddenInputProps,
	TimeFieldErrorMessageOptions,
	TimeFieldErrorMessageCommonProps,
	TimeFieldErrorMessageRenderProps,
	TimeFieldErrorMessageProps,
	TimeFieldDescriptionOptions,
	TimeFieldDescriptionCommonProps,
	TimeFieldDescriptionRenderProps,
	TimeFieldDescriptionProps,
	TimeFieldSegmentOptions,
	TimeFieldSegmentCommonProps,
	TimeFieldSegmentRenderProps,
	TimeFieldSegmentProps,
	TimeFieldFieldOptions,
	TimeFieldFieldCommonProps,
	TimeFieldFieldRenderProps,
	TimeFieldFieldProps,
	TimeFieldLabelOptions,
	TimeFieldLabelCommonProps,
	TimeFieldLabelRenderProps,
	TimeFieldLabelProps,
	TimeFieldRootOptions,
	TimeFieldRootCommonProps,
	TimeFieldRootRenderProps,
	TimeFieldRootProps,
};

export { Root, Label, Field, Segment, Description, ErrorMessage, HiddenInput };

export const TimeField = Object.assign(Root, {
	Label,
	Field,
	Segment,
	Description,
	ErrorMessage,
	HiddenInput,
});
