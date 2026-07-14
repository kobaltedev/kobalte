import {
	ImageFallback as Fallback,
	type ImageFallbackCommonProps,
	type ImageFallbackOptions,
	type ImageFallbackProps,
	type ImageFallbackRenderProps,
} from "./image-fallback.tsx";
import {
	type ImageImgCommonProps,
	type ImageImgOptions,
	type ImageImgProps,
	type ImageImgRenderProps,
	ImageImg as Img,
} from "./image-img.tsx";
import {
	type ImageRootCommonProps,
	type ImageRootOptions,
	type ImageRootProps,
	type ImageRootRenderProps,
	ImageRoot as Root,
} from "./image-root.tsx";

export type {
	ImageFallbackOptions,
	ImageFallbackCommonProps,
	ImageFallbackRenderProps,
	ImageFallbackProps,
	ImageImgOptions,
	ImageImgCommonProps,
	ImageImgRenderProps,
	ImageImgProps,
	ImageRootOptions,
	ImageRootCommonProps,
	ImageRootRenderProps,
	ImageRootProps,
};
export { Fallback, Img, Root };

export const Image = Object.assign(Root, {
	Fallback,
	Img,
});

/**
 * API will most probably change
 */
export { useImageContext, type ImageContextValue } from "./image-context.tsx";
