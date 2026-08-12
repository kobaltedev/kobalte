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
} from "../form-control/index.ts";

import {
	ColorAreaBackground as Background,
	type ColorAreaBackgroundCommonProps,
	type ColorAreaBackgroundOptions,
	type ColorAreaBackgroundProps,
	type ColorAreaBackgroundRenderProps,
} from "./color-area-background.tsx";
import {
	type ColorAreaHiddenInputXProps,
	ColorAreaHiddenInputX as HiddenInputX,
} from "./color-area-hidden-input-x.tsx";
import {
	type ColorAreaHiddenInputYProps,
	ColorAreaHiddenInputY as HiddenInputY,
} from "./color-area-hidden-input-y.tsx";
import {
	type ColorAreaRootCommonProps,
	type ColorAreaRootOptions,
	type ColorAreaRootProps,
	type ColorAreaRootRenderProps,
	ColorAreaRoot as Root,
} from "./color-area-root.tsx";
import {
	type ColorAreaThumbCommonProps,
	type ColorAreaThumbOptions,
	type ColorAreaThumbProps,
	type ColorAreaThumbRenderProps,
	ColorAreaThumb as Thumb,
} from "./color-area-thumb.tsx";

export type {
	ColorAreaBackgroundCommonProps,
	ColorAreaBackgroundOptions,
	ColorAreaBackgroundProps,
	ColorAreaBackgroundRenderProps,
	ColorAreaDescriptionCommonProps,
	ColorAreaDescriptionOptions,
	ColorAreaDescriptionProps,
	ColorAreaDescriptionRenderProps,
	ColorAreaErrorMessageCommonProps,
	ColorAreaErrorMessageOptions,
	ColorAreaErrorMessageProps,
	ColorAreaErrorMessageRenderProps,
	ColorAreaHiddenInputXProps,
	ColorAreaHiddenInputYProps,
	ColorAreaLabelCommonProps,
	ColorAreaLabelOptions,
	ColorAreaLabelProps,
	ColorAreaLabelRenderProps,
	ColorAreaRootCommonProps,
	ColorAreaRootOptions,
	ColorAreaRootProps,
	ColorAreaRootRenderProps,
	ColorAreaThumbCommonProps,
	ColorAreaThumbOptions,
	ColorAreaThumbProps,
	ColorAreaThumbRenderProps,
};
export {
	Background,
	Description,
	ErrorMessage,
	HiddenInputX,
	HiddenInputY,
	Label,
	Root,
	Thumb,
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
 * API will most change
 */
export {
	type ColorAreaContextValue,
	useColorAreaContext,
} from "./color-area-context.tsx";
