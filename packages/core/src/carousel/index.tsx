import {
	CarouselRoot as Root,
	type CarouselRootOptions,
	type CarouselRootCommonProps,
	type CarouselRootProps,
	type CarouselRootRenderProps,
} from "./carousel-root";
import {
	CarouselViewport as Viewport,
	type CarouselViewportOptions,
	type CarouselViewportCommonProps,
	type CarouselViewportProps,
	type CarouselViewportRenderProps,
} from "./carousel-viewport";
import {
	CarouselItem as Item,
	type CarouselItemOptions,
	type CarouselItemCommonProps,
	type CarouselItemProps,
	type CarouselItemRenderProps,
} from "./carousel-item";
import {
	CarouselPrevious as Previous,
	type CarouselPreviousOptions,
	type CarouselPreviousCommonProps,
	type CarouselPreviousProps,
} from "./carousel-previous";
import {
	CarouselNext as Next,
	type CarouselNextOptions,
	type CarouselNextCommonProps,
	type CarouselNextProps,
} from "./carousel-next";
import {
	CarouselIndicator as Indicator,
	type CarouselIndicatorOptions,
	type CarouselIndicatorCommonProps,
	type CarouselIndicatorProps,
	type CarouselIndicatorRenderProps,
} from "./carousel-indicator";
export type {
	CarouselRootOptions,
	CarouselRootCommonProps,
	CarouselRootProps,
	CarouselRootRenderProps,
	CarouselViewportOptions,
	CarouselViewportCommonProps,
	CarouselViewportProps,
	CarouselViewportRenderProps,
	CarouselItemOptions,
	CarouselItemCommonProps,
	CarouselItemProps,
	CarouselItemRenderProps,
	CarouselPreviousOptions,
	CarouselPreviousCommonProps,
	CarouselPreviousProps,
	CarouselNextOptions,
	CarouselNextCommonProps,
	CarouselNextProps,
	CarouselIndicatorOptions,
	CarouselIndicatorCommonProps,
	CarouselIndicatorProps,
	CarouselIndicatorRenderProps,
};
export { Root, Viewport, Item, Previous, Next, Indicator };
export const Carousel = Object.assign(Root, {
	Viewport,
	Item,
	Previous,
	Next,
	Indicator,
});
