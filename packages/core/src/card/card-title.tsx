import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createEffect, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useCardContext } from "./card-context";

export interface CardTitleOptions {}

export interface CardTitleCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface CardTitleRenderProps extends CardTitleCommonProps {}

export type CardTitleProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CardTitleOptions & Partial<CardTitleCommonProps<ElementOf<T>>>;

/**
 * An accessible title for the card, wired to `Card.Root` via `aria-labelledby`.
 */
export function CardTitle<T extends ValidComponent = "h3">(
	props: PolymorphicProps<T, CardTitleProps<T>>,
) {
	const context = useCardContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("title"),
		},
		props as CardTitleProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerTitleId(id),
	);

	return (
		<Polymorphic<CardTitleRenderProps>
			as="h3"
			id={mergedProps.id}
			{...others}
		/>
	);
}
