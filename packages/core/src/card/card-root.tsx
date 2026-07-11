import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createSignal, createUniqueId, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createRegisterId } from "../primitives";
import { CardContext, type CardContextValue } from "./card-context";

export interface CardRootOptions {
	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;
}

export interface CardRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface CardRootRenderProps extends CardRootCommonProps {
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export type CardRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CardRootOptions & Partial<CardRootCommonProps<ElementOf<T>>>;

/**
 * A card groups related content and actions in a single container.
 *
 * Unlike `Dialog`, a card is not a landmark region by default — a
 * dashboard with many cards forcing `role="region"` on each would clutter
 * screen reader landmark navigation. Pass `role="region"` explicitly to
 * opt in when a card is a meaningful landmark on the page.
 */
export function CardRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CardRootProps<T>>,
) {
	const defaultId = `card-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as CardRootProps,
	);

	const [titleId, setTitleId] = createSignal<string | undefined>(undefined, {
		ownedWrite: true,
	});
	const [descriptionId, setDescriptionId] = createSignal<string | undefined>(
		undefined,
		{ ownedWrite: true },
	);

	const others = omit(mergedProps, "id");

	const context: CardContextValue = {
		generateId: createGenerateId(() => mergedProps.id!),
		registerTitleId: createRegisterId(setTitleId),
		registerDescriptionId: createRegisterId(setDescriptionId),
	};

	return (
		<CardContext value={context}>
			<Polymorphic<CardRootRenderProps>
				as="div"
				id={mergedProps.id}
				aria-labelledby={titleId()}
				aria-describedby={descriptionId()}
				{...others}
			/>
		</CardContext>
	);
}
