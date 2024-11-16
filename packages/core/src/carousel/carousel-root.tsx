import { type Orientation, mergeDefaultProps } from "@kobalte/utils";
import {
	type ValidComponent,
	createSignal,
	createEffect,
	createUniqueId,
	splitProps,
	on,
	onMount,
} from "solid-js";
import createEmblaCarousel from "embla-carousel-solid";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { CarouselContext, type CarouselContextValue } from "./carousel-context";

export interface CarouselRootOptions {
	/** The controlled value of the selected slide index. */
	selectedIndex?: number;

	/** The index of the slide that should be active when initially rendered. */
	defaultSelectedIndex?: number;

	/** Event handler called when the selected index changes. */
	onSelectedIndexChange?: (index: number) => void;

	/** The orientation of the carousel. */
	orientation?: Orientation;

	/** Whether the carousel is disabled. */
	disabled?: boolean;

	/** Whether the carousel should loop. */
	//loop?: boolean;

	/** Whether the carousel should align slides to the start or center. */
	//align?: "start" | "center";

	/** Whether the carousel should drag free or snap to slides. */
	//dragFree?: boolean;

	/** Custom embla carousel options. */
	options?: ReturnType<NonNullable<Parameters<typeof createEmblaCarousel>[0]>>;

	/** Custom embla carousel plugins */
	plugins?: ReturnType<NonNullable<Parameters<typeof createEmblaCarousel>[1]>>;
}

export interface CarouselRootCommonProps<T extends HTMLElement = HTMLElement> {
	id?: string;
}

export interface CarouselRootRenderProps extends CarouselRootCommonProps {
	role: "region";
	"aria-roledescription": "carousel";
	"data-orientation": Orientation;
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
		"options",
		"selectedIndex",
		"defaultSelectedIndex",
		"onSelectedIndexChange",
		"orientation",
		"disabled",
		"plugins"
	]);

	const [carouselRef, api] = createEmblaCarousel(() => ({
		...local.options,
		axis: local.orientation === "horizontal" ? "x" : "y",
	}),
		() => local.plugins ?? []
	);

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

	onMount(() => {
		if (!api()) return;
		setCanScrollPrev(api()?.canScrollPrev() ?? false);
		setCanScrollNext(api()?.canScrollNext() ?? false);
	})

	createEffect(on([() => api()], ([embla]) => {
		if (!embla) return;

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

	return (
		<CarouselContext.Provider value={context}>
			<Polymorphic<CarouselRootRenderProps>
				as="div"
				role="region"
				ref={carouselRef}
				aria-roledescription="carousel"
				data-orientation={context.orientation()}
				{...others}
			/>
		</CarouselContext.Provider>
	);
}
