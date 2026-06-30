import {
	ImageFallback as Fallback,
	type ImageFallbackCommonProps,
	type ImageFallbackOptions,
	type ImageFallbackProps,
	type ImageFallbackRenderProps,
} from "./image-fallback";
import {
	type ImageImgCommonProps,
	type ImageImgOptions,
	type ImageImgProps,
	type ImageImgRenderProps,
	ImageImg as Img,
} from "./image-img";
import {
	type ImageRootCommonProps,
	type ImageRootOptions,
	type ImageRootProps,
	type ImageRootRenderProps,
	ImageRoot as Root,
} from "./image-root";

export type {
	ImageFallbackCommonProps,
	ImageFallbackOptions,
	ImageFallbackProps,
	ImageFallbackRenderProps,
	ImageImgCommonProps,
	ImageImgOptions,
	ImageImgProps,
	ImageImgRenderProps,
	ImageRootCommonProps,
	ImageRootOptions,
	ImageRootProps,
	ImageRootRenderProps,
};
export { Fallback, Img, Root };

export const Image = Object.assign(Root, {
	Fallback,
	Img,
});

/**
 * API will most probably change
 */
export { type ImageContextValue, useImageContext } from "./image-context";
