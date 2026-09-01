import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useCardContext } from "./card-context";

export interface CardDescriptionOptions {}

export interface CardDescriptionCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface CardDescriptionRenderProps
	extends CardDescriptionCommonProps {}

export type CardDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CardDescriptionOptions & Partial<CardDescriptionCommonProps<ElementOf<T>>>;

/**
 * An optional accessible description for the card, wired to `Card.Root`
 * via `aria-describedby`.
 */
export function CardDescription<T extends ValidComponent = "p">(
	props: PolymorphicProps<T, CardDescriptionProps<T>>,
) {
	const context = useCardContext();

	const mergedProps = merge(
		{
			id: context.generateId("description"),
		},
		props as CardDescriptionProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerDescriptionId(id!),
	);

	return (
		<Polymorphic<CardDescriptionRenderProps>
			as="p"
			id={mergedProps.id}
			{...others}
		/>
	);
}
