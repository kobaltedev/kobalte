import { type ValidComponent, splitProps } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useCarouselContext } from "./carousel-context";

export interface CarouselIndicatorOptions {
	/** The index this indicator represents and will navigate to when clicked. */
	index: number;
}

export interface CarouselIndicatorCommonProps<T extends HTMLElement = HTMLElement> {
	ref?: T | ((el: T) => void);
}

export interface CarouselIndicatorRenderProps extends CarouselIndicatorCommonProps {
	role: "tab";
	type: "button";
	"aria-label": string;
	"aria-selected": boolean;
	"data-orientation": string;
	"data-selected": string | undefined;
	onClick: () => void;
}

export type CarouselIndicatorProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	CarouselIndicatorOptions & Partial<CarouselIndicatorCommonProps<ElementOf<T>>>;

/**
 * A button that allows users to navigate directly to a specific slide.
 */
export function CarouselIndicator<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, CarouselIndicatorProps<T>>
) {
	const context = useCarouselContext();
	const [local, others] = splitProps(props as CarouselIndicatorProps, ["index", "ref"]);

	const isSelected = () => context.selectedIndex() === local.index;

	return (
		<Polymorphic<CarouselIndicatorRenderProps>
			as="button"
			ref={local.ref}
			role="tab"
			type="button"
			aria-label={`Slide ${local.index + 1}`}
			aria-selected={isSelected()}
			data-orientation={context.orientation()}
			data-selected={isSelected() ? "" : undefined}
			onClick={() => { context.scrollTo(local.index) }}
			{...others}
		/>
	);
}
