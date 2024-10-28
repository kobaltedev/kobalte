import {
	type ValidComponent,
	createEffect,
	createMemo,
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

export type { SearchSingleSelectionOptions, SearchMultipleSelectionOptions };

// SearchBase wraps Combobox without `defaultFilter` as filtering is handled externally - eg: on database
export interface SearchBaseOptions<Option, OptGroup = never>
	extends Omit<ComboboxBaseOptions<Option, OptGroup>, "defaultFilter"> {}

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
		],
		// @ts-expect-error filter is handled externally, so it's omitted
		["defaultFilter"],
	);

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
		if (local.multiple) {
			local.onChange?.((value ?? []) as any);
		} else {
			// use `null` as "no value" because `undefined` mean the component is "uncontrolled".
			local.onChange?.((value[0] ?? null) as any); // TODO: maybe return undefined? breaking change!
		}
	};

	return (
		<ComboboxBase
			options={local.options}
			value={value() as any}
			defaultValue={defaultValue() as any}
			defaultFilter={() => true}
			onChange={onChange}
			selectionMode={local.multiple ? "multiple" : "single"}
			{...others}
		/>
	);
}
