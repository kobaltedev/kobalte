import type { ValidComponent } from "@solidjs/web";
import { Show } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useTagsInputContext } from "./tags-input-context";
import { useTagsInputItemContext } from "./tags-input-item-context";

export interface TagsInputItemPreviewOptions {}

export interface TagsInputItemPreviewCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface TagsInputItemPreviewRenderProps
	extends TagsInputItemPreviewCommonProps {}

export type TagsInputItemPreviewProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TagsInputItemPreviewOptions &
	Partial<TagsInputItemPreviewCommonProps<ElementOf<T>>>;

/**
 * Displays the tag's text and delete trigger. Hidden while the tag is being edited
 * (see `TagsInput.ItemInput`).
 */
export function TagsInputItemPreview<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TagsInputItemPreviewProps<T>>,
) {
	const context = useTagsInputContext();
	const itemContext = useTagsInputItemContext();

	return (
		<Show when={context.editingIndex() !== itemContext.index()}>
			<Polymorphic<TagsInputItemPreviewRenderProps>
				as="div"
				{...(props as TagsInputItemPreviewProps)}
			/>
		</Show>
	);
}
