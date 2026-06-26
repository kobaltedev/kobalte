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
	SliderDescriptionCommonProps,
	SliderDescriptionOptions,
	SliderDescriptionProps,
	SliderDescriptionRenderProps,
	SliderErrorMessageCommonProps,
	SliderErrorMessageOptions,
	SliderErrorMessageProps,
	SliderErrorMessageRenderProps,
	SliderFillCommonProps,
	SliderFillOptions,
	SliderFillProps,
	SliderFillRenderProps,
	SliderGetValueLabelParams,
	SliderInputProps,
	SliderLabelCommonProps,
	SliderLabelOptions,
	SliderLabelProps,
	SliderLabelRenderProps,
	SliderRootCommonProps,
	SliderRootOptions,
	SliderRootProps,
	SliderRootRenderProps,
	SliderThumbCommonProps,
	SliderThumbOptions,
	SliderThumbProps,
	SliderThumbRenderProps,
	SliderTrackCommonProps,
	SliderTrackOptions,
	SliderTrackProps,
	SliderTrackRenderProps,
	SliderValueLabelCommonProps,
	SliderValueLabelOptions,
	SliderValueLabelProps,
	SliderValueLabelRenderProps,
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
export { type SliderContextValue, useSliderContext } from "./slider-context";
