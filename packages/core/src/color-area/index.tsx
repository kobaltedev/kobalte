import {
	type FormControlDescriptionCommonProps as ColorAreaDescriptionCommonProps,
	type FormControlDescriptionOptions as ColorAreaDescriptionOptions,
	type FormControlDescriptionProps as ColorAreaDescriptionProps,
	type FormControlDescriptionRenderProps as ColorAreaDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as ColorAreaErrorMessageCommonProps,
	type FormControlErrorMessageOptions as ColorAreaErrorMessageOptions,
	type FormControlErrorMessageProps as ColorAreaErrorMessageProps,
	type FormControlErrorMessageRenderProps as ColorAreaErrorMessageRenderProps,
	type FormControlLabelCommonProps as ColorAreaLabelCommonProps,
	type FormControlLabelOptions as ColorAreaLabelOptions,
	type FormControlLabelProps as ColorAreaLabelProps,
	type FormControlLabelRenderProps as ColorAreaLabelRenderProps,
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	FormControlLabel as Label,
} from "../form-control";

import {
	ColorAreaBackground as Background,
	type ColorAreaBackgroundCommonProps,
	type ColorAreaBackgroundOptions,
	type ColorAreaBackgroundProps,
	type ColorAreaBackgroundRenderProps,
} from "./color-area-background";
import {
	type ColorAreaHiddenInputXProps,
	ColorAreaHiddenInputX as HiddenInputX,
} from "./color-area-hidden-input-x";
import {
	type ColorAreaHiddenInputYProps,
	ColorAreaHiddenInputY as HiddenInputY,
} from "./color-area-hidden-input-y";
import {
	type ColorAreaRootCommonProps,
	type ColorAreaRootOptions,
	type ColorAreaRootProps,
	type ColorAreaRootRenderProps,
	ColorAreaRoot as Root,
} from "./color-area-root";
import {
	type ColorAreaThumbCommonProps,
	type ColorAreaThumbOptions,
	type ColorAreaThumbProps,
	type ColorAreaThumbRenderProps,
	ColorAreaThumb as Thumb,
} from "./color-area-thumb";

export type {
	ColorAreaDescriptionProps,
	ColorAreaDescriptionOptions,
	ColorAreaDescriptionCommonProps,
	ColorAreaDescriptionRenderProps,
	ColorAreaErrorMessageOptions,
	ColorAreaErrorMessageCommonProps,
	ColorAreaErrorMessageRenderProps,
	ColorAreaErrorMessageProps,
	ColorAreaLabelOptions,
	ColorAreaLabelCommonProps,
	ColorAreaLabelRenderProps,
	ColorAreaLabelProps,
	ColorAreaRootOptions,
	ColorAreaRootCommonProps,
	ColorAreaRootRenderProps,
	ColorAreaRootProps,
	ColorAreaBackgroundOptions,
	ColorAreaBackgroundCommonProps,
	ColorAreaBackgroundRenderProps,
	ColorAreaBackgroundProps,
	ColorAreaThumbOptions,
	ColorAreaThumbCommonProps,
	ColorAreaThumbRenderProps,
	ColorAreaThumbProps,
	ColorAreaHiddenInputXProps,
	ColorAreaHiddenInputYProps,
};
export {
	Description,
	ErrorMessage,
	Label,
	Root,
	Background,
	Thumb,
	HiddenInputX,
	HiddenInputY,
};

export const ColorArea = Object.assign(Root, {
	Description,
	ErrorMessage,
	Label,
	Background,
	Thumb,
	HiddenInputX,
	HiddenInputY,
});

/**
 * API will most probably change
 */
export {
	useColorAreaContext,
	type ColorAreaContextValue,
} from "./color-area-context";
