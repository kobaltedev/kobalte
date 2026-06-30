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
	TimeFieldDescriptionCommonProps,
	TimeFieldDescriptionOptions,
	TimeFieldDescriptionProps,
	TimeFieldDescriptionRenderProps,
	TimeFieldErrorMessageCommonProps,
	TimeFieldErrorMessageOptions,
	TimeFieldErrorMessageProps,
	TimeFieldErrorMessageRenderProps,
	TimeFieldFieldCommonProps,
	TimeFieldFieldOptions,
	TimeFieldFieldProps,
	TimeFieldFieldRenderProps,
	TimeFieldHiddenInputProps,
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

export { Description, ErrorMessage, Field, HiddenInput, Label, Root, Segment };

export const TimeField = Object.assign(Root, {
	Label,
	Field,
	Segment,
	Description,
	ErrorMessage,
	HiddenInput,
});
