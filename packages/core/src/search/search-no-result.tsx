import { Show, type ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useSearchContext } from "./search-context";

export interface SearchNoResultOptions {}

export interface SearchNoResultCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface SearchNoResultRenderProps extends SearchNoResultCommonProps {}

export type SearchNoResultProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SearchNoResultOptions & Partial<SearchNoResultCommonProps<ElementOf<T>>>;

/**
 * Displayed in portal when no options are presented
 */
export function SearchNoResult<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, SearchNoResultProps<T>>,
) {
	const context = useSearchContext();

	return (
		<Show when={context.noResult()}>
			<Polymorphic as="div" {...props} />
		</Show>
	);
}
