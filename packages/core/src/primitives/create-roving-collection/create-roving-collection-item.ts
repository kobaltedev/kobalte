import { access, type MaybeAccessor } from "@solid-primitives/utils";
import type { Accessor } from "solid-js";

import { createSelectableItem } from "../../selection";
import { createDomCollectionItem } from "../create-dom-collection";
import type { RovingCollection } from "./create-roving-collection";

export interface CreateRovingCollectionItemProps {
	/** The group's roving collection state, as returned by `createRovingCollection`. */
	listState: RovingCollection["listState"];

	/** A unique key for the item within the group. */
	key: MaybeAccessor<string>;

	/** A string value for the item, used for features like typeahead. */
	textValue: MaybeAccessor<string>;

	/** Whether the item is disabled. */
	disabled?: MaybeAccessor<boolean | undefined>;
}

/**
 * Registers an item in a `createRovingCollection` group and wires up the
 * roving-tabindex/focus interactions for it.
 */
export function createRovingCollectionItem<T extends HTMLElement>(
	props: CreateRovingCollectionItemProps,
	ref: Accessor<T | undefined>,
) {
	const key = () => access(props.key);
	const isDisabled = () => access(props.disabled) ?? false;

	createDomCollectionItem({
		getItem: () => ({
			ref,
			type: "item",
			key: key(),
			textValue: access(props.textValue),
			disabled: isDisabled(),
		}),
	});

	return createSelectableItem(
		{
			key,
			selectionManager: () => props.listState().selectionManager(),
			disabled: isDisabled,
		},
		ref,
	);
}
