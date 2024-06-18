import { mergeDefaultProps } from "@kobalte/utils";
import { Show, type ValidComponent, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type ListboxItemDataSet,
	useListboxItemContext,
} from "./listbox-item-context";

export interface ListboxItemIndicatorOptions {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface ListboxItemIndicatorCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface ListboxItemIndicatorRenderProps
	extends ListboxItemIndicatorCommonProps,
		ListboxItemDataSet {
	"aria-hidden": "true";
}

export type ListboxItemIndicatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ListboxItemIndicatorOptions &
	Partial<ListboxItemIndicatorCommonProps<ElementOf<T>>>;

/**
 * The visual indicator rendered when the item is selected.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function ListboxItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ListboxItemIndicatorProps<T>>,
) {
	const context = useListboxItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("indicator"),
		},
		props as ListboxItemIndicatorProps,
	);

	const [local, others] = splitProps(mergedProps, ["forceMount"]);

	return (
		<Show when={local.forceMount || context.isSelected()}>
			<Polymorphic<ListboxItemIndicatorRenderProps>
				as="div"
				aria-hidden="true"
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
