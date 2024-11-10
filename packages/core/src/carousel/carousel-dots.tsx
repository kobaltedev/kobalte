import { For, JSX } from "solid-js";
import { type ValidComponent, splitProps } from "solid-js";
import * as Button from "../button";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useCarouselContext } from "./carousel-context";

export interface CarouselDotsOptions { }

export interface CarouselDotsCommonProps<T extends HTMLElement = HTMLElement> {
	/** The component to render as a dot button */
	dotComponent?: (props: { index: number; isSelected: boolean }) => JSX.Element;
}

export interface CarouselDotsRenderProps extends CarouselDotsCommonProps {
	children?: JSX.Element;
}

export type CarouselDotsProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	CarouselDotsOptions & Partial<CarouselDotsCommonProps<ElementOf<T>>>;

export function CarouselDots<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CarouselDotsProps<T>>
) {
	const context = useCarouselContext();
	const [local, others] = splitProps(props as CarouselDotsProps, ["dotComponent"]);

	const DefaultDot = (props: { index: number; isSelected: boolean }) => (
		<Button.Root
			aria-label={`Go to slide ${props.index + 1}`}
			data-selected={props.isSelected ? "" : undefined}
			onClick={() => context.scrollTo(props.index)}
		/>
	);

	const DotComponent = local.dotComponent || DefaultDot;

	return (
		<Polymorphic<CarouselDotsRenderProps>
			as="div"
			{...others}
		>
			<For each={context.scrollSnaps()}>
				{(_, index) => (
					<DotComponent
						index={index()}
						isSelected={index() === context.selectedIndex()}
					/>
				)}
			</For>
		</Polymorphic>
	);
}
