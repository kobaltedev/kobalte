import type { JSX, ValidComponent } from "@solidjs/web";
import { omit, Show } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useSearchContext } from "./search-context";

export interface SearchIndicatorOptions {}

export interface SearchIndicatorCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	children: JSX.Element;
	loadingComponent?: JSX.Element;
}

export interface SearchIndicatorRenderProps
	extends SearchIndicatorCommonProps {}

export type SearchIndicatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SearchIndicatorOptions & Partial<SearchIndicatorCommonProps<ElementOf<T>>>;

export function SearchIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SearchIndicatorProps<T>>,
) {
	const other = omit(props, "loadingComponent");
	const context = useSearchContext();

	return (
		<Polymorphic as="span" aria-hidden="true" {...other}>
			<Show
				when={
					context.isLoadingSuggestions() === false || !props.loadingComponent
				}
				fallback={props.loadingComponent}
			>
				{props.children}
			</Show>
		</Polymorphic>
	);
}
