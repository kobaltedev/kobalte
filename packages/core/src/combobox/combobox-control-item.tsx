import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createUniqueId, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createRovingCollectionItem } from "../primitives/create-roving-collection";
import { useComboboxControlContext } from "./combobox-control-context";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxControlItemOptions<Option> {
	/** The selected option this chip represents. */
	option: Option;

	/** The index of this chip within the list of selected options. */
	index: number;

	/** A string value for the chip, used for features like typeahead. */
	textValue: string;
}

export interface ComboboxControlItemCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface ComboboxControlItemRenderProps
	extends ComboboxControlItemCommonProps {
	tabindex: number | undefined;
	"data-highlighted": "" | undefined;
	"data-disabled": "" | undefined;
}

export type ComboboxControlItemProps<
	Option,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ComboboxControlItemOptions<Option> &
	Partial<ComboboxControlItemCommonProps<ElementOf<T>>>;

/**
 * A removable, keyboard-navigable chip for a single selected option, rendered
 * inside `Combobox.Control`. Opt-in: only mount it if you want arrow-key
 * navigation and Backspace/Delete removal between already-selected chips —
 * `Combobox.Control`'s `remove`/`selectedOptions` render-prop state works
 * without it.
 *
 * Render these with `<For each={state.selectedOptions()} keyed={false}>` (not
 * the default keyed mode). Chips are identified by their position, and
 * roving focus/removal moves an existing chip's index rather than remounting
 * it — with the default keyed `<For>`, removing a chip briefly unregisters
 * the index of every chip after it, and focus is lost instead of landing on
 * a neighbor.
 */
export function ComboboxControlItem<Option, T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ComboboxControlItemProps<Option, T>>,
) {
	let ref: HTMLElement | undefined;

	const context = useComboboxContext();
	const controlContext = useComboboxControlContext();

	const defaultId = context.generateId(`control-item-${createUniqueId()}`);

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as ComboboxControlItemProps<Option>,
	);

	const others = omit(
		mergedProps,
		"ref",
		"option",
		"index",
		"textValue",
		"id",
		"onKeyDown",
		"onFocus",
	);

	const isDisabled = () => context.isDisabled();

	const key = () => String(mergedProps.index);

	const selectableItem = createRovingCollectionItem(
		{
			listState: controlContext.rovingListState,
			key,
			textValue: () => mergedProps.textValue,
			disabled: isDisabled,
		},
		() => ref,
	);

	const isHighlighted = () =>
		controlContext.rovingListState().selectionManager().focusedKey() ===
		key();

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown as typeof onKeyDown);

		if (isDisabled()) {
			return;
		}

		const selectedCount = context.selectedOptions().length;

		switch (e.key) {
			case "Backspace":
			case "Delete": {
				e.preventDefault();

				const index = mergedProps.index;
				const remaining = selectedCount - 1;

				context.removeOptionFromSelection(mergedProps.option, remaining <= 0);

				if (remaining <= 0) {
					context.inputRef()?.focus();
				} else {
					controlContext.focusItemAt(String(Math.min(index, remaining - 1)));
				}

				break;
			}
			case "ArrowLeft":
				if (mergedProps.index > 0) {
					e.preventDefault();
					controlContext.focusItemAt(String(mergedProps.index - 1));
				}

				break;
			case "ArrowRight":
				e.preventDefault();

				if (mergedProps.index < selectedCount - 1) {
					controlContext.focusItemAt(String(mergedProps.index + 1));
				} else {
					context.inputRef()?.focus();
				}

				break;
		}
	};

	return (
		<Polymorphic<ComboboxControlItemRenderProps>
			as="div"
			ref={mergeRefs((el) => (ref = el as HTMLElement), mergedProps.ref)}
			id={mergedProps.id}
			tabindex={selectableItem.tabIndex()}
			data-highlighted={isHighlighted() ? "" : undefined}
			data-disabled={isDisabled() ? "" : undefined}
			onKeyDown={onKeyDown}
			onFocus={selectableItem.onFocus}
			{...others}
		/>
	);
}
