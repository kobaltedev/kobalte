import { ValidComponent } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";

export interface ListboxSectionOptions {}

export interface ListboxSectionCommonProps {}

export interface ListboxSectionRenderProps extends ListboxSectionCommonProps {
	role: "presentation";
}

export type ListboxSectionProps = ListboxSectionOptions &
	Partial<ListboxSectionCommonProps>;

/**
 * A component used to render the label of a listbox option group.
 * It won't be focusable using arrow keys.
 */
export function ListboxSection<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ListboxSectionProps>,
) {
	return (
		<Polymorphic<ListboxSectionRenderProps>
			as="li"
			role="presentation"
			{...(props as ListboxSectionProps)}
		/>
	);
}
