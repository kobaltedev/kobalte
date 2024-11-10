import { mergeDefaultProps } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
	splitProps,
} from "solid-js";
import createEmblaCarousel from 'embla-carousel-solid';
import type { EmblaOptionsType } from 'embla-carousel';

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { CarouselContext, type CarouselContextValue } from "./carousel-context";

export interface CarouselRootOptions {
	/** The options passed to Embla Carousel. */
	options?: EmblaOptionsType;

	/** Event handler called when the selected slide changes. */
	onSelectedIndexChange?: (index: number) => void;

	/** Whether the carousel is disabled. */
	disabled?: boolean;
}

export interface CarouselRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	children: JSX.Element;
}

export interface CarouselRootRenderProps extends CarouselRootCommonProps {
	"data-disabled": "" | undefined;
}

export type CarouselRootProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	CarouselRootOptions & Partial<CarouselRootCommonProps<ElementOf<T>>>;

export function CarouselRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CarouselRootProps<T>>
) {
	const defaultId = `carousel-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			options: {},
		},
		props as CarouselRootProps
	);

	const [local, others] = splitProps(mergedProps, [
		"options",
		"onSelectedIndexChange",
		"disabled",
		"children",
	]);

	const [emblaRef, emblaApi] = createEmblaCarousel(() => local.options);
	const [canScrollNext, setCanScrollNext] = createSignal(false);
	const [canScrollPrev, setCanScrollPrev] = createSignal(false);
	const [selectedIndex, setSelectedIndex] = createSignal(0);
	const [scrollSnaps, setScrollSnaps] = createSignal<number[]>([]);

	const onSelect = () => {
		if (!emblaApi()) return;

		setSelectedIndex(emblaApi()!.selectedScrollSnap());
		setCanScrollPrev(emblaApi()!.canScrollPrev());
		setCanScrollNext(emblaApi()!.canScrollNext());
		local.onSelectedIndexChange?.(emblaApi()!.selectedScrollSnap());
	};

	onMount(() => {
		if (!emblaApi()) return;

		setScrollSnaps(emblaApi()!.scrollSnapList());
		emblaApi()!.on("select", onSelect);
		onSelect();
	});

	onCleanup(() => {
		if (!emblaApi()) return;
		emblaApi()!.off("select", onSelect);
	});

	const context: CarouselContextValue = {
		emblaApi,
		canScrollNext,
		canScrollPrev,
		scrollNext: () => emblaApi()?.scrollNext(),
		scrollPrev: () => emblaApi()?.scrollPrev(),
		scrollTo: (index: number) => emblaApi()?.scrollTo(index),
		selectedIndex,
		scrollSnaps,
	};

	return (
		<CarouselContext.Provider value={context}>
			<Polymorphic<CarouselRootRenderProps>
				as="div"
				ref={emblaRef}
				data-disabled={local.disabled ? "" : undefined}
				{...others}
			>
				{local.children}
			</Polymorphic>
		</CarouselContext.Provider>
	);
}
