import {
	type FormControlDescriptionCommonProps as ColorWheelDescriptionCommonProps,
	type FormControlDescriptionOptions as ColorWheelDescriptionOptions,
	type FormControlDescriptionProps as ColorWheelDescriptionProps,
	type FormControlDescriptionRenderProps as ColorWheelDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as ColorWheelErrorMessageCommonProps,
	type FormControlErrorMessageOptions as ColorWheelErrorMessageOptions,
	type FormControlErrorMessageProps as ColorWheelErrorMessageProps,
	type FormControlErrorMessageRenderProps as ColorWheelErrorMessageRenderProps,
	type FormControlLabelCommonProps as ColorWheelLabelCommonProps,
	type FormControlLabelOptions as ColorWheelLabelOptions,
	type FormControlLabelProps as ColorWheelLabelProps,
	type FormControlLabelRenderProps as ColorWheelLabelRenderProps,
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	FormControlLabel as Label,
} from "../form-control";

import {
	type ColorWheelInputProps,
	ColorWheelInput as Input,
} from "./color-wheel-input";
import {
	type ColorWheelRootCommonProps,
	type ColorWheelRootOptions,
	type ColorWheelRootProps,
	type ColorWheelRootRenderProps,
	ColorWheelRoot as Root,
} from "./color-wheel-root";
import {
	type ColorWheelThumbCommonProps,
	type ColorWheelThumbOptions,
	type ColorWheelThumbProps,
	type ColorWheelThumbRenderProps,
	ColorWheelThumb as Thumb,
} from "./color-wheel-thumb";
import {
	type ColorWheelTrackCommonProps,
	type ColorWheelTrackOptions,
	type ColorWheelTrackProps,
	type ColorWheelTrackRenderProps,
	ColorWheelTrack as Track,
} from "./color-wheel-track";
import {
	type ColorWheelValueLabelCommonProps,
	type ColorWheelValueLabelOptions,
	type ColorWheelValueLabelProps,
	type ColorWheelValueLabelRenderProps,
	ColorWheelValueLabel as ValueLabel,
} from "./color-wheel-value-label";

export type {
	ColorWheelDescriptionProps,
	ColorWheelDescriptionOptions,
	ColorWheelDescriptionCommonProps,
	ColorWheelDescriptionRenderProps,
	ColorWheelErrorMessageOptions,
	ColorWheelErrorMessageCommonProps,
	ColorWheelErrorMessageRenderProps,
	ColorWheelErrorMessageProps,
	ColorWheelInputProps,
	ColorWheelLabelOptions,
	ColorWheelLabelCommonProps,
	ColorWheelLabelRenderProps,
	ColorWheelLabelProps,
	ColorWheelRootOptions,
	ColorWheelRootCommonProps,
	ColorWheelRootRenderProps,
	ColorWheelRootProps,
	ColorWheelThumbOptions,
	ColorWheelThumbCommonProps,
	ColorWheelThumbRenderProps,
	ColorWheelThumbProps,
	ColorWheelTrackOptions,
	ColorWheelTrackCommonProps,
	ColorWheelTrackRenderProps,
	ColorWheelTrackProps,
	ColorWheelValueLabelOptions,
	ColorWheelValueLabelCommonProps,
	ColorWheelValueLabelRenderProps,
	ColorWheelValueLabelProps,
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

export const ColorWheel = Object.assign(Root, {
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
	useColorWheelContext,
	type ColorWheelContextValue,
} from "./color-wheel-context";
