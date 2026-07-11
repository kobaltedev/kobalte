import type { ValidComponent } from "@solidjs/web";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface CardHeaderOptions {}

export interface CardHeaderCommonProps<T extends HTMLElement = HTMLElement> {}

export interface CardHeaderRenderProps extends CardHeaderCommonProps {}

export type CardHeaderProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CardHeaderOptions & Partial<CardHeaderCommonProps<ElementOf<T>>>;

/**
 * Groups a card's title, description and header action.
 * Ships no layout — arrange `Card.Title`/`Card.Description` alongside
 * `Card.HeaderAction` with your own CSS (e.g. a two-column grid).
 */
export function CardHeader<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CardHeaderProps<T>>,
) {
	return <Polymorphic<CardHeaderRenderProps> as="div" {...props} />;
}
