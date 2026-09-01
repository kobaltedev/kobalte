import type { ValidComponent } from "@solidjs/web";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface CardFooterOptions {}

export interface CardFooterCommonProps<T extends HTMLElement = HTMLElement> {}

export interface CardFooterRenderProps extends CardFooterCommonProps {}

export type CardFooterProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CardFooterOptions & Partial<CardFooterCommonProps<ElementOf<T>>>;

/**
 * Contains the footer content of a card (e.g. actions).
 */
export function CardFooter<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CardFooterProps<T>>,
) {
	return <Polymorphic<CardFooterRenderProps> as="div" {...props} />;
}
