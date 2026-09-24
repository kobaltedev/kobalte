import type { Accessor } from "solid-js";
import { createContext, useContext } from "solid-js";

export interface TagsInputItemContextValue {
	/**
	 * The current value of the tag. An accessor (not a plain string) because
	 * `<For keyed={false}>` reuses the same `TagsInput.Item` instance by
	 * position — editing a tag, or removing an earlier one and shifting this
	 * item's index, must be reflected without remounting.
	 */
	value: Accessor<string>;

	/** The index of the tag in the list of tags. */
	index: Accessor<number>;
}

export const TagsInputItemContext = createContext<TagsInputItemContextValue>();

export function useTagsInputItemContext() {
	const context = useContext(TagsInputItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useTagsInputItemContext` must be used within a `TagsInput.Item` component",
		);
	}

	return context;
}
