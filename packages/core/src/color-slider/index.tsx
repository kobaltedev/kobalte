import {
	type FormControlDescriptionCommonProps as ColorSliderDescriptionCommonProps,
	type FormControlDescriptionOptions as ColorSliderDescriptionOptions,
	type FormControlDescriptionProps as ColorSliderDescriptionProps,
	type FormControlDescriptionRenderProps as ColorSliderDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as ColorSliderErrorMessageCommonProps,
	type FormControlErrorMessageOptions as ColorSliderErrorMessageOptions,
	type FormControlErrorMessageProps as ColorSliderErrorMessageProps,
	type FormControlErrorMessageRenderProps as ColorSliderErrorMessageRenderProps,
	type FormControlLabelCommonProps as ColorSliderLabelCommonProps,
	type FormControlLabelOptions as ColorSliderLabelOptions,
	type FormControlLabelProps as ColorSliderLabelProps,
	type FormControlLabelRenderProps as ColorSliderLabelRenderProps,
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	FormControlLabel as Label,
} from "../form-control";

import {
	type SliderInputProps as ColorSliderInputProps,
	type SliderValueLabelCommonProps as ColorSliderValueLabelCommonProps,
	type SliderValueLabelOptions as ColorSliderValueLabelOptions,
	type SliderValueLabelProps as ColorSliderValueLabelProps,
	type SliderValueLabelRenderProps as ColorSliderValueLabelRenderProps,
	Input,
	ValueLabel,
} from "../slider";
import {
	type ColorSliderRootCommonProps,
	type ColorSliderRootOptions,
	type ColorSliderRootProps,
	type ColorSliderRootRenderProps,
	ColorSliderRoot as Root,
} from "./color-slider-root";
import {
	type ColorSliderThumbCommonProps,
	type ColorSliderThumbOptions,
	type ColorSliderThumbProps,
	type ColorSliderThumbRenderProps,
	ColorSliderThumb as Thumb,
} from "./color-slider-thumb";
import {
	type ColorSliderTrackCommonProps,
	type ColorSliderTrackOptions,
	type ColorSliderTrackProps,
	type ColorSliderTrackRenderProps,
	ColorSliderTrack as Track,
} from "./color-slider-track";

export type {
	ColorSliderDescriptionCommonProps,
	ColorSliderDescriptionOptions,
	ColorSliderDescriptionProps,
	ColorSliderDescriptionRenderProps,
	ColorSliderErrorMessageCommonProps,
	ColorSliderErrorMessageOptions,
	ColorSliderErrorMessageProps,
	ColorSliderErrorMessageRenderProps,
	ColorSliderInputProps,
	ColorSliderLabelCommonProps,
	ColorSliderLabelOptions,
	ColorSliderLabelProps,
	ColorSliderLabelRenderProps,
	ColorSliderRootCommonProps,
	ColorSliderRootOptions,
	ColorSliderRootProps,
	ColorSliderRootRenderProps,
	ColorSliderThumbCommonProps,
	ColorSliderThumbOptions,
	ColorSliderThumbProps,
	ColorSliderThumbRenderProps,
	ColorSliderTrackCommonProps,
	ColorSliderTrackOptions,
	ColorSliderTrackProps,
	ColorSliderTrackRenderProps,
	ColorSliderValueLabelCommonProps,
	ColorSliderValueLabelOptions,
	ColorSliderValueLabelProps,
	ColorSliderValueLabelRenderProps,
};
export {
	Description,
	ErrorMessage,
	Input,
	Label,
	Root,
	Thumb,
	Track,
	ValueLabel,
};

export const ColorSlider = Object.assign(Root, {
	Description,
	ErrorMessage,
	Input,
	Label,
	Thumb,
	Track,
	ValueLabel,
});

/**
 * API will most probably change
 */
export {
	type ColorSliderContextValue,
	useColorSliderContext,
} from "./color-slider-context";
