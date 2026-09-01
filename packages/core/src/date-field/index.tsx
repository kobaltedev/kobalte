import {
	type FormControlDescriptionCommonProps as DateFieldDescriptionCommonProps,
	type FormControlDescriptionOptions as DateFieldDescriptionOptions,
	type FormControlDescriptionProps as DateFieldDescriptionProps,
	type FormControlDescriptionRenderProps as DateFieldDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as DateFieldErrorMessageCommonProps,
	type FormControlErrorMessageOptions as DateFieldErrorMessageOptions,
	type FormControlErrorMessageProps as DateFieldErrorMessageProps,
	type FormControlErrorMessageRenderProps as DateFieldErrorMessageRenderProps,
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
} from "../form-control/index.ts";
import {
	type DateFieldHiddenInputProps,
	DateFieldHiddenInput as HiddenInput,
} from "./date-field-hidden-input.tsx";
import {
	type DateFieldInputCommonProps,
	type DateFieldInputOptions,
	type DateFieldInputProps,
	type DateFieldInputRenderProps,
	DateFieldInput as Input,
} from "./date-field-input.tsx";
import {
	type DateFieldLabelCommonProps,
	type DateFieldLabelOptions,
	type DateFieldLabelProps,
	type DateFieldLabelRenderProps,
	DateFieldLabel as Label,
} from "./date-field-label.tsx";
import {
	type DateFieldRootCommonProps,
	type DateFieldRootOptions,
	type DateFieldRootProps,
	type DateFieldRootRenderProps,
	DateFieldRoot as Root,
} from "./date-field-root.tsx";
import {
	type DateFieldSegmentCommonProps,
	type DateFieldSegmentOptions,
	type DateFieldSegmentProps,
	type DateFieldSegmentRenderProps,
	DateFieldSegment as Segment,
} from "./date-field-segment.tsx";

export type {
	DateFieldGranularity,
	DateFieldHourCycle,
	DateFieldMaxGranularity,
	DateSegment,
	DateValue,
	SegmentType,
} from "./types.ts";
export type {
	DateFieldDescriptionCommonProps,
	DateFieldDescriptionOptions,
	DateFieldDescriptionProps,
	DateFieldDescriptionRenderProps,
	DateFieldErrorMessageCommonProps,
	DateFieldErrorMessageOptions,
	DateFieldErrorMessageProps,
	DateFieldErrorMessageRenderProps,
	DateFieldHiddenInputProps,
	DateFieldInputCommonProps,
	DateFieldInputOptions,
	DateFieldInputProps,
	DateFieldInputRenderProps,
	DateFieldLabelCommonProps,
	DateFieldLabelOptions,
	DateFieldLabelProps,
	DateFieldLabelRenderProps,
	DateFieldRootCommonProps,
	DateFieldRootOptions,
	DateFieldRootProps,
	DateFieldRootRenderProps,
	DateFieldSegmentCommonProps,
	DateFieldSegmentOptions,
	DateFieldSegmentProps,
	DateFieldSegmentRenderProps,
};

export { Description, ErrorMessage, HiddenInput, Input, Label, Root, Segment };

export const DateField = Object.assign(Root, {
	Label,
	Input,
	Segment,
	Description,
	ErrorMessage,
	HiddenInput,
});
