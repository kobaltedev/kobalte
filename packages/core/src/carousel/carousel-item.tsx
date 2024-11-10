import { type ValidComponent, splitProps, JSX } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useCarouselContext } from "./carousel-context";

export interface CarouselItemOptions { }

export interface CarouselItemCommonProps<T extends HTMLElement = HTMLElement> {
	children: JSX.Element;
}

export interface CarouselItemRenderProps extends CarouselItemCommonProps {
	"data-active": "" | undefined;
}

export type CarouselItemProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	CarouselItemOptions & Partial<CarouselItemCommonProps<ElementOf<T>>>;

export function CarouselItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CarouselItemProps<T>>
) {
	const context = useCarouselContext();
	const [local, others] = splitProps(props, ["children"]) as [
		{ children: JSX.Element },
		{ ref?: HTMLElement }
	];

	const isActive = () => {
		const api = context.emblaApi();
		if (!api) return false;
		const currentIndex = api.selectedScrollSnap();
		const slideNodes = api.slideNodes();
		const currentNode = slideNodes[currentIndex];
		return currentNode === others.ref;
	};

	return (
		<Polymorphic<CarouselItemRenderProps>
			as="div"
			//class="embla__slide"
			data-active={isActive() ? "" : undefined}
			{...others}
		>
			{local.children}
		</Polymorphic>
	);
}
