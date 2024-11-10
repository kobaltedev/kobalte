import {
	CarouselDots as Dots,
	type CarouselDotsOptions,
	type CarouselDotsCommonProps,
	type CarouselDotsRenderProps,
	type CarouselDotsProps,
} from "./carousel-dots";
import {
	CarouselItem as Item,
	type CarouselItemProps,
	type CarouselItemOptions,
	type CarouselItemCommonProps,
	type CarouselItemRenderProps,
} from "./carousel-item";
import {
	CarouselNext as Next,
	type CarouselNextProps,
	type CarouselNextOptions,
	type CarouselNextCommonProps,
	type CarouselNextRenderProps,
} from "./carousel-next";
import {
	CarouselPrevious as Previous,
	type CarouselPreviousProps,
	type CarouselPreviousOptions,
	type CarouselPreviousCommonProps,
	type CarouselPreviousRenderProps,
} from "./carousel-previous";
import {
	CarouselRoot as Root,
	type CarouselRootProps,
	type CarouselRootOptions,
	type CarouselRootCommonProps,
	type CarouselRootRenderProps,
} from "./carousel-root";
import {
	CarouselViewport as Viewport,
	type CarouselViewportProps,
	type CarouselViewportOptions,
	type CarouselViewportCommonProps,
	type CarouselViewportRenderProps,
} from "./carousel-viewport";
export type {
	CarouselDotsOptions,
	CarouselDotsCommonProps,
	CarouselDotsRenderProps,
	CarouselDotsProps,
	CarouselItemOptions,
	CarouselItemCommonProps,
	CarouselItemRenderProps,
	CarouselItemProps,
	CarouselNextOptions,
	CarouselNextCommonProps,
	CarouselNextRenderProps,
	CarouselNextProps,
	CarouselPreviousOptions,
	CarouselPreviousCommonProps,
	CarouselPreviousRenderProps,
	CarouselPreviousProps,
	CarouselRootOptions,
	CarouselRootCommonProps,
	CarouselRootRenderProps,
	CarouselRootProps,
	CarouselViewportOptions,
	CarouselViewportCommonProps,
	CarouselViewportRenderProps,
	CarouselViewportProps,
};
export { Dots, Item, Next, Previous, Root, Viewport };
export const Carousel = Object.assign(Root, {
	Dots,
	Item,
	Next,
	Previous,
	Viewport,
});
