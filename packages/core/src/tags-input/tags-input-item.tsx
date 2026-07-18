import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createUniqueId, omit } from "solid-js";
import { useFormControlContext } from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createRovingCollectionItem } from "../primitives/create-roving-collection";
import { useTagsInputContext } from "./tags-input-context";
import { TagsInputItemContext } from "./tags-input-item-context";

export interface TagsInputItemOptions {
	/** The current value of the tag. */
	value: string;

	/** The index of the tag within the list of tags. */
	index: number;
}

export interface TagsInputItemCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onDblClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface TagsInputItemRenderProps extends TagsInputItemCommonProps {
	tabindex: number | undefined;
	"data-highlighted": "" | undefined;
	"data-disabled": "" | undefined;
	"data-value": string;
}

export type TagsInputItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TagsInputItemOptions & Partial<TagsInputItemCommonProps<ElementOf<T>>>;

/**
 * The container for a single tag. Establishes the item context consumed by
 * `TagsInput.ItemPreview`, `TagsInput.ItemText`, `TagsInput.ItemInput` and
 * `TagsInput.ItemDeleteTrigger`.
 */
export function TagsInputItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TagsInputItemProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const formControlContext = useFormControlContext();
	const context = useTagsInputContext();

	const defaultId = context.generateId(`item-${createUniqueId()}`);

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as TagsInputItemProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"value",
		"index",
		"id",
		"onKeyDown",
		"onFocus",
		"onDblClick",
	);

	const isDisabled = () => formControlContext.isDisabled() ?? false;

	const key = () => String(mergedProps.index);

	const selectableItem = createRovingCollectionItem(
		{
			listState: context.listState,
			key,
			textValue: () => mergedProps.value,
			disabled: isDisabled,
		},
		() => ref,
	);

	const isHighlighted = () =>
		context.listState().selectionManager().focusedKey() === key();

	const startEditing = () => {
		if (
			!isDisabled() &&
			!formControlContext.isReadOnly() &&
			context.isEditable()
		) {
			context.setEditingIndex(mergedProps.index);
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown as typeof onKeyDown);

		if (isDisabled()) {
			return;
		}

		// While this tag is being edited, its `TagsInput.ItemInput` owns all
		// keyboard handling (typing, cursor movement, commit/cancel) — don't
		// also interpret the same keys as tag-level shortcuts.
		if (context.editingIndex() === mergedProps.index) {
			return;
		}

		switch (e.key) {
			case "Enter":
				e.preventDefault();
				startEditing();
				break;
			case "Backspace":
			case "Delete": {
				if (formControlContext.isReadOnly()) {
					break;
				}

				e.preventDefault();

				const index = mergedProps.index;
				const remaining = context.value().length - 1;

				context.removeTagAt(index);

				if (remaining <= 0) {
					context.focusInput();
				} else {
					context.focusItemAt(Math.min(index, remaining - 1));
				}

				break;
			}
			case "ArrowLeft":
				if (mergedProps.index > 0) {
					e.preventDefault();
					context.focusItemAt(mergedProps.index - 1);
				}

				break;
			case "ArrowRight":
				e.preventDefault();

				if (mergedProps.index < context.value().length - 1) {
					context.focusItemAt(mergedProps.index + 1);
				} else {
					context.focusInput();
				}

				break;
		}
	};

	const onDblClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, mergedProps.onDblClick);
		startEditing();
	};

	return (
		<TagsInputItemContext
			value={{
				value: () => mergedProps.value,
				index: () => mergedProps.index,
			}}
		>
			<Polymorphic<TagsInputItemRenderProps>
				as="div"
				ref={mergeRefs((el) => (ref = el as HTMLElement), mergedProps.ref)}
				id={mergedProps.id}
				tabindex={selectableItem.tabIndex()}
				data-highlighted={isHighlighted() ? "" : undefined}
				data-disabled={isDisabled() ? "" : undefined}
				data-value={mergedProps.value}
				onKeyDown={onKeyDown}
				onFocus={selectableItem.onFocus}
				onDblClick={onDblClick}
				{...others}
			/>
		</TagsInputItemContext>
	);
}
