import {
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	FormControlLabel as Label,
	type FormControlDescriptionCommonProps as SliderDescriptionCommonProps,
	type FormControlDescriptionOptions as SliderDescriptionOptions,
	type FormControlDescriptionProps as SliderDescriptionProps,
	type FormControlDescriptionRenderProps as SliderDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as SliderErrorMessageCommonProps,
	type FormControlErrorMessageOptions as SliderErrorMessageOptions,
	type FormControlErrorMessageProps as SliderErrorMessageProps,
	type FormControlErrorMessageRenderProps as SliderErrorMessageRenderProps,
	type FormControlLabelCommonProps as SliderLabelCommonProps,
	type FormControlLabelOptions as SliderLabelOptions,
	type FormControlLabelProps as SliderLabelProps,
	type FormControlLabelRenderProps as SliderLabelRenderProps,
} from "../form-control";
import {
	SliderFill as Fill,
	type SliderFillCommonProps,
	type SliderFillOptions,
	type SliderFillProps,
	type SliderFillRenderProps,
} from "./slider-fill";
import { SliderInput as Input, type SliderInputProps } from "./slider-input";
import {
	SliderRoot as Root,
	type GetValueLabelParams as SliderGetValueLabelParams,
	type SliderRootCommonProps,
	type SliderRootOptions,
	type SliderRootProps,
	type SliderRootRenderProps,
} from "./slider-root";
import {
	type SliderThumbCommonProps,
	type SliderThumbOptions,
	type SliderThumbProps,
	type SliderThumbRenderProps,
	SliderThumb as Thumb,
} from "./slider-thumb";
import {
	type SliderTrackCommonProps,
	type SliderTrackOptions,
	type SliderTrackProps,
	type SliderTrackRenderProps,
	SliderTrack as Track,
} from "./slider-track";
import {
	type SliderValueLabelCommonProps,
	type SliderValueLabelOptions,
	type SliderValueLabelProps,
	type SliderValueLabelRenderProps,
	SliderValueLabel as ValueLabel,
} from "./slider-value-label";

export type {
	SliderDescriptionProps,
	SliderDescriptionOptions,
	SliderDescriptionCommonProps,
	SliderDescriptionRenderProps,
	SliderErrorMessageOptions,
	SliderErrorMessageCommonProps,
	SliderErrorMessageRenderProps,
	SliderErrorMessageProps,
	SliderFillOptions,
	SliderFillCommonProps,
	SliderFillRenderProps,
	SliderFillProps,
	SliderGetValueLabelParams,
	SliderInputProps,
	SliderLabelOptions,
	SliderLabelCommonProps,
	SliderLabelRenderProps,
	SliderLabelProps,
	SliderRootOptions,
	SliderRootCommonProps,
	SliderRootRenderProps,
	SliderRootProps,
	SliderThumbOptions,
	SliderThumbCommonProps,
	SliderThumbRenderProps,
	SliderThumbProps,
	SliderTrackOptions,
	SliderTrackCommonProps,
	SliderTrackRenderProps,
	SliderTrackProps,
	SliderValueLabelOptions,
	SliderValueLabelCommonProps,
	SliderValueLabelRenderProps,
	SliderValueLabelProps,
};
export {
	Description,
	ErrorMessage,
	Fill,
	Input,
	Label,
	Root,
	Thumb,
	Track,
	ValueLabel,
};

export const Slider = Object.assign(Root, {
	Description,
	ErrorMessage,
	Fill,
	Input,
	Label,
	Thumb,
	Track,
	ValueLabel,
});

/**
 * API will most probably change
 */
export { useSliderContext, type SliderContextValue } from "./slider-context";
