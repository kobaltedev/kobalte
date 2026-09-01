import type { ValidComponent } from "@solidjs/web";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface CardContentOptions {}

export interface CardContentCommonProps<T extends HTMLElement = HTMLElement> {}

export interface CardContentRenderProps extends CardContentCommonProps {}

export type CardContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CardContentOptions & Partial<CardContentCommonProps<ElementOf<T>>>;

/**
 * Contains the main content of a card.
 */
export function CardContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CardContentProps<T>>,
) {
	return <Polymorphic<CardContentRenderProps> as="div" {...props} />;
}
