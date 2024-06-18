import type { ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface ListboxSectionOptions {}

export interface ListboxSectionCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface ListboxSectionRenderProps extends ListboxSectionCommonProps {
	role: "presentation";
}

export type ListboxSectionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ListboxSectionOptions & Partial<ListboxSectionCommonProps<ElementOf<T>>>;

/**
 * A component used to render the label of a listbox option group.
 * It won't be focusable using arrow keys.
 */
export function ListboxSection<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ListboxSectionProps<T>>,
) {
	return (
		<Polymorphic<ListboxSectionRenderProps>
			as="li"
			role="presentation"
			{...(props as ListboxSectionProps)}
		/>
	);
}
