import { type Accessor, createContext, useContext } from "solid-js";
import type { ListState } from "../list";

export interface TagsInputContextValue {
	/** The current tag values. */
	value: Accessor<string[]>;

	/** The current value of the text input used to compose a new tag. */
	inputValue: Accessor<string>;

	/** Sets the value of the text input. */
	setInputValue: (value: string) => void;

	/** The index of the tag currently being edited, if any. */
	editingIndex: Accessor<number | undefined>;

	/** Sets the index of the tag currently being edited. */
	setEditingIndex: (index: number | undefined) => void;

	/** Whether an existing tag can be edited. */
	isEditable: Accessor<boolean>;

	/** Whether pasting text should split it by `delimiter` into separate tags. */
	addOnPaste: Accessor<boolean>;

	/** The character (or pattern) used to split typed/pasted text into separate tags. */
	delimiter: Accessor<string | RegExp>;

	/** What to do with any leftover input text when the input loses focus. */
	blurBehavior: Accessor<"add" | "clear" | undefined>;

	/** Whether the whole component (input or a tag) currently contains focus. */
	isFocused: Accessor<boolean>;

	/** Sets whether the whole component currently contains focus. */
	setIsFocused: (isFocused: boolean) => void;

	/** The list state used to track which tag currently has roving focus. */
	listState: Accessor<ListState>;

	generateId: (part: string) => string;

	/**
	 * Attempts to add `rawValue` as a new tag (trimming, validating against
	 * `maxLength`/`max`/duplicates/`validate`). Returns whether it was added.
	 */
	addTagValue: (rawValue: string) => boolean;

	/** Removes the tag at `index`. */
	removeTagAt: (index: number) => void;

	/**
	 * Attempts to replace the tag at `index` with `rawValue` (subject to the
	 * same validation as `addTagValue`, but allowing the tag to keep its own
	 * previous value). Returns whether the edit was applied.
	 */
	editTagAt: (index: number, rawValue: string) => boolean;

	/** Removes every tag. */
	clearTags: () => void;

	/** Moves DOM focus to the text input. */
	focusInput: () => void;

	/** Moves roving DOM focus to the tag at `index`. */
	focusItemAt: (index: number) => void;

	/** Registers the text input element so `focusInput` can reach it. */
	setInputRef: (el: HTMLInputElement | undefined) => void;
}

export const TagsInputContext = createContext<TagsInputContextValue>();

export function useTagsInputContext() {
	const context = useContext(TagsInputContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useTagsInputContext` must be used within a `TagsInput.Root` component",
		);
	}

	return context;
}
