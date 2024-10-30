import {
	type ValidComponent,
	createEffect,
	createMemo,
	createSignal,
	splitProps,
} from "solid-js";
import {
	ComboboxBase,
	type ComboboxBaseOptions,
	type ComboboxBaseRenderProps as SearchBaseRenderProps,
} from "../combobox/combobox-base";
import type {
	ComboboxMultipleSelectionOptions as SearchMultipleSelectionOptions,
	ComboboxSingleSelectionOptions as SearchSingleSelectionOptions,
} from "../combobox/combobox-root";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { SearchContext, type SearchContextValue } from "./search-context";
import { DebouncerTimeout } from "./utils";

export type { SearchSingleSelectionOptions, SearchMultipleSelectionOptions };

// SearchBase wraps Combobox without `defaultFilter` as filtering is handled externally - eg: on database
export interface SearchBaseOptions<Option, OptGroup = never>
	extends Omit<ComboboxBaseOptions<Option, OptGroup>, "defaultFilter"> {
	/** Debounces input before making suggestions */
	debounceOptionsMillisecond?: number;
}

export type SearchRootOptions<Option, OptGroup = never> = (
	| SearchSingleSelectionOptions<Option>
	| SearchMultipleSelectionOptions<Option>
) &
	Omit<
		SearchBaseOptions<Option, OptGroup>,
		"value" | "defaultValue" | "onChange" | "selectionMode"
	>;

export interface SearchRootCommonProps<T extends HTMLElement = HTMLElement> {}

export interface SearchRootRenderProps
	extends SearchRootCommonProps,
		SearchBaseRenderProps {}

export type SearchRootProps<
	Option,
	OptGroup = never,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SearchRootOptions<Option, OptGroup> &
	Partial<SearchRootCommonProps<ElementOf<T>>>;

/**
 * A search is a combobox where the filter is external.
 */
export function SearchRoot<
	Option,
	OptGroup = never,
	T extends ValidComponent = "div",
>(props: PolymorphicProps<T, SearchRootProps<Option, OptGroup, T>>) {
	const [local, omit, others] = splitProps(
		props as SearchRootProps<Option, OptGroup>,
		[
			"options",
			"value",
			"defaultValue",
			"onChange",
			"multiple",
			"onInputChange",
			"debounceOptionsMillisecond",
		],
		// @ts-expect-error filter is handled externally, so it's omitted
		["defaultFilter"],
	);

	const [isLoadingSuggestions, setIsLoadingSuggestions] = createSignal(false);
	const [suggestionTimeout, setSuggestionTimeout] =
		createSignal<NodeJS.Timeout>();

	const inputChangeDebouncer = DebouncerTimeout();
	createEffect(() =>
		inputChangeDebouncer.setDebounceMillisecond(
			local.debounceOptionsMillisecond,
		),
	);
	const onInputChange = (value: string) => {
		if (local.onInputChange === undefined) return;
		setIsLoadingSuggestions(true);
		const timeout = inputChangeDebouncer.debounce(async () => {
			await local.onInputChange!(value);
			setIsLoadingSuggestions(false);
		});
		setSuggestionTimeout(timeout);
	};

	const value = createMemo(() => {
		if (local.value != null) {
			return local.multiple ? local.value : [local.value];
		}

		return local.value;
	});

	const defaultValue = createMemo(() => {
		if (local.defaultValue != null) {
			return local.multiple ? local.defaultValue : [local.defaultValue];
		}

		return local.defaultValue;
	});

	const onChange = (value: Option[]) => {
		clearTimeout(suggestionTimeout());
		setIsLoadingSuggestions(false);
		if (local.multiple) {
			local.onChange?.((value ?? []) as any);
		} else {
			// use `null` as "no value" because `undefined` mean the component is "uncontrolled".
			local.onChange?.((value[0] ?? null) as any); // TODO: maybe return undefined? breaking change!
		}
	};

	const noResult = () => local.options.length === 0;

	const context: SearchContextValue = {
		noResult,
		isLoadingSuggestions,
	};

	return (
		<SearchContext.Provider value={context}>
			<ComboboxBase
				closeOnSelection
				shouldFocusWrap
				noResetInputOnBlur
				allowsEmptyCollection={true}
				options={local.options as any}
				value={value() as any}
				defaultValue={defaultValue() as any}
				onInputChange={onInputChange}
				defaultFilter={() => true}
				onChange={onChange as any}
				selectionMode={local.multiple ? "multiple" : "single"}
				{...others}
			/>
		</SearchContext.Provider>
	);
}
