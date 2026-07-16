import type { ValidComponent } from "@solidjs/web";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useTagsInputItemContext } from "./tags-input-item-context";

export interface TagsInputItemTextOptions {}

export interface TagsInputItemTextCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface TagsInputItemTextRenderProps
	extends TagsInputItemTextCommonProps {
	children: string;
}

export type TagsInputItemTextProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TagsInputItemTextOptions &
	Partial<TagsInputItemTextCommonProps<ElementOf<T>>>;

/**
 * Displays the current value of the tag.
 */
export function TagsInputItemText<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, TagsInputItemTextProps<T>>,
) {
	const itemContext = useTagsInputItemContext();

	return (
		<Polymorphic<TagsInputItemTextRenderProps>
			as="span"
			{...(props as TagsInputItemTextProps)}
		>
			{itemContext.value()}
		</Polymorphic>
	);
}
