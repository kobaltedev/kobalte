import { type Orientation, mergeDefaultProps, callHandler } from "@kobalte/utils";
import {
	type ValidComponent,
	createSignal,
	createEffect,
	createUniqueId,
	splitProps,
	on,
	JSX,
} from "solid-js";
import createEmblaCarousel from "embla-carousel-solid";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { CarouselContext, type CarouselContextValue } from "./carousel-context";
import { AlignmentOptionType } from "embla-carousel/components/Alignment";
import { SlidesInViewOptionsType } from "embla-carousel/components/SlidesInView";
import { SlidesToScrollOptionType } from "embla-carousel/components/SlidesToScroll";
import { ScrollContainOptionType } from "embla-carousel/components/ScrollContain";
import { DragHandlerOptionType } from "embla-carousel/components/DragHandler";
import { ResizeHandlerOptionType } from "embla-carousel/components/ResizeHandler";
import { SlidesHandlerOptionType } from "embla-carousel/components/SlidesHandler";
import { FocusHandlerOptionType } from "embla-carousel/components/SlideFocus";

export interface CarouselRootOptions {
	/** The alignment of the slides in the carousel. */
	align?: AlignmentOptionType;

	/** The index of the slide that should be active when initially rendered. */
	defaultSelectedIndex?: number;

	/** The duration of the scroll animation in milliseconds. */
	duration?: number;

	/** The controlled value of the selected slide index. */
	startIndex?: number;

	/** Event handler called when the selected index changes. */
	onSelectedIndexChange?: (index: number) => void;

	/** The orientation of the carousel. */
	orientation?: Orientation;

	/** Whether the carousel is disabled. */
	disabled?: boolean;

	/** Whether the carousel should loop. */
	loop?: boolean;

	/** Whether the carousel should drag free or snap to slides. */
	dragFree?: boolean;

	/** The number of slides to scroll at a time. */
	slidesToScroll?: SlidesToScrollOptionType;

	/** The drag threshold in pixels before a drag movement starts. */
	dragThreshold?: number;

	/** The threshold for considering a slide in view. */
	inViewThreshold?: SlidesInViewOptionsType;

	/** Whether to skip snap points when scrolling. */
	skipSnaps?: boolean;

	/** How to handle scrolling when content is contained within bounds. */
	containScroll?: ScrollContainOptionType;

	/** The direction of the carousel (ltr or rtl). */
	direction?: Orientation;

	/** Whether to watch for drag interactions. */
	watchDrag?: DragHandlerOptionType;

	/** Whether to watch for resize events. */
	watchResize?: ResizeHandlerOptionType;

	/** Whether to watch for changes to slides. */
	watchSlides?: SlidesHandlerOptionType;

	/** Whether to watch for focus events. */
	watchFocus?: FocusHandlerOptionType;

	/** Custom embla carousel plugins */
	plugins?: ReturnType<NonNullable<Parameters<typeof createEmblaCarousel>[1]>>;
}

export interface CarouselRootCommonProps<T extends HTMLElement = HTMLElement> {
	id?: string;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface CarouselRootRenderProps extends CarouselRootCommonProps {
	role: "region";
	"aria-roledescription": "carousel";
	"data-orientation": Orientation;
	"aria-label"?: string;
}

export type CarouselRootProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	CarouselRootOptions & Partial<CarouselRootCommonProps<ElementOf<T>>>;

/**
 * A carousel component that allows cycling through items with optional autoplay and navigation controls.
 */
export function CarouselRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CarouselRootProps<T>>
) {
	const defaultId = `carousel-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps({
		id: defaultId,
		orientation: "horizontal",
		defaultSelectedIndex: 0,
	}, props as CarouselRootProps);

	const [local, others] = splitProps(mergedProps, [
		"startIndex",
		"defaultSelectedIndex",
		"onSelectedIndexChange",
		"orientation",
		"disabled",
		"loop",
		"align",
		"dragFree",
		"slidesToScroll",
		"dragThreshold",
		"inViewThreshold",
		"skipSnaps",
		"duration",
		"containScroll",
		"watchDrag",
		"watchResize",
		"watchSlides",
		"watchFocus",
		"plugins",
		"onKeyDown"
	]);

	const [carouselRef, api] = createEmblaCarousel(() => ({
		axis: local.orientation === "vertical" ? "y" : "x",
		loop: local.loop || false,
		align: local.align || "start",
		dragFree: local.dragFree || false,
		dragThreshold: local.dragThreshold || 10,
		slidesToScroll: local.slidesToScroll || 1,
		startIndex: local.startIndex || 0,
		inViewThreshold: local.inViewThreshold || 0,
		skipSnaps: local.skipSnaps || false,
		duration: local.duration || 25,
		containScroll: local.containScroll || "trimSnaps",
		watchDrag: local.watchDrag || true,
		watchResize: local.watchResize || true,
		watchSlides: local.watchSlides || true,
		watchFocus: local.watchFocus || true,
	}), () => local.plugins ?? []);

	const [canScrollPrev, setCanScrollPrev] = createSignal(false);
	const [canScrollNext, setCanScrollNext] = createSignal(false);
	const [selectedIndex, setSelectedIndex] = createSignal(local.defaultSelectedIndex ?? 0);

	const scrollPrev = () => {
		if (!api()) return;
		api()?.scrollPrev();
		updateSelectedIndex();
	};

	const scrollNext = () => {
		if (!api()) return;
		api()?.scrollNext();
		updateSelectedIndex();
	};

	const scrollTo = (index: number) => {
		if (!api()) return;
		api()?.scrollTo(index);
		updateSelectedIndex();
	};

	const updateSelectedIndex = () => {
		const embla = api();
		if (!embla) return;

		const index = embla.selectedScrollSnap();
		setSelectedIndex(index);
		local.onSelectedIndexChange?.(index);
	};

	createEffect(on([() => api()], ([embla]) => {
		if (!embla) return;

		embla.on("init", () => {
			setCanScrollPrev(embla.canScrollPrev());
			setCanScrollNext(embla.canScrollNext());
		});

		embla.on("select", () => {
			setCanScrollPrev(embla.canScrollPrev());
			setCanScrollNext(embla.canScrollNext());
			updateSelectedIndex();
		});
	}));

	const context: CarouselContextValue = {
		isDisabled: () => local.disabled ?? false,
		orientation: () => local.orientation!,
		canScrollPrev,
		canScrollNext,
		selectedIndex,
		api: () => api,
		scrollPrev,
		scrollNext,
		scrollTo,
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		if (local.disabled) {
			return;
		}

		switch (e.key) {
			case "ArrowLeft":
				if (local.orientation === "horizontal") {
					e.preventDefault();
					scrollPrev();
				}
				break;
			case "ArrowRight":
				if (local.orientation === "horizontal") {
					e.preventDefault();
					scrollNext();
				}
				break;
			case "ArrowUp":
				if (local.orientation === "vertical") {
					e.preventDefault();
					scrollPrev();
				}
				break;
			case "ArrowDown":
				if (local.orientation === "vertical") {
					e.preventDefault();
					scrollNext();
				}
				break;
			case "Home":
				e.preventDefault();
				scrollTo(0);
				break;
			case "End":
				e.preventDefault();
				const lastIndex = api()!.scrollSnapList()!.length - 1;
				scrollTo(lastIndex);
				break;
		}
	};

	return (
		<CarouselContext.Provider value={context}>
			<Polymorphic<CarouselRootRenderProps>
				as="div"
				role="region"
				ref={carouselRef}
				aria-roledescription="carousel"
				data-orientation={context.orientation()}
				onKeyDown={onKeyDown}
				{...others}
			/>
		</CarouselContext.Provider>
	);
}
