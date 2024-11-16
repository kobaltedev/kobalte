import { type ValidComponent, splitProps } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useCarouselContext } from "./carousel-context";

export interface CarouselItemOptions {
	/** The index of this item in the carousel. */
	index: number;
}

export interface CarouselItemCommonProps<T extends HTMLElement = HTMLElement> {
	ref?: T | ((el: T) => void);
}

export interface CarouselItemRenderProps extends CarouselItemCommonProps {
	role: "group";
	"aria-roledescription": "slide";
	"data-orientation": string;
	"data-selected": string | undefined;
}

export type CarouselItemProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	CarouselItemOptions & Partial<CarouselItemCommonProps<ElementOf<T>>>;

/**
 * An individual slide within the carousel.
 */
export function CarouselItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CarouselItemProps<T>>
) {
	const context = useCarouselContext();
	const [local, others] = splitProps(props as CarouselItemProps, ["index", "ref"]);

	const isSelected = () => context.selectedIndex() === local.index;

	return (
		<Polymorphic<CarouselItemRenderProps>
			as="div"
			ref={local.ref}
			role="group"
			aria-roledescription="slide"
			data-orientation={context.orientation()}
			data-selected={isSelected() ? "" : undefined}
			{...others}
		/>
	);
}
