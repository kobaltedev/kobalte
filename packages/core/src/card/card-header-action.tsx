import type { ValidComponent } from "@solidjs/web";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface CardHeaderActionOptions {}

export interface CardHeaderActionCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface CardHeaderActionRenderProps
	extends CardHeaderActionCommonProps {}

export type CardHeaderActionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CardHeaderActionOptions &
	Partial<CardHeaderActionCommonProps<ElementOf<T>>>;

/**
 * A structural slot for a trailing header action (e.g. an icon button or
 * menu trigger), so it can be grid/flex-positioned against `Card.Title`/
 * `Card.Description` without an extra wrapper `div`. Ships no layout —
 * this is a positioning hook for your own CSS, not a styled component.
 */
export function CardHeaderAction<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CardHeaderActionProps<T>>,
) {
	return <Polymorphic<CardHeaderActionRenderProps> as="div" {...props} />;
}
