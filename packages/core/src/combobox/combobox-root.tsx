import { OverrideComponentProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import {
	type Component,
	createMemo,
	omit,
} from "solid-js";

import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	ComboboxBase,
	type ComboboxBaseOptions,
	type ComboboxBaseRenderProps,
} from "./combobox-base";

export interface ComboboxSingleSelectionOptions<T> {
	/** The controlled value of the combobox. */
	value?: T | null;

	/**
	 * The value of the combobox when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: T;

	/** Event handler called when the value changes. */
	onChange?: (value: T | null) => void;

	/** Whether the combobox allow multiple selection. */
	multiple?: false;
}

export interface ComboboxMultipleSelectionOptions<T> {
	/** The controlled value of the combobox. */
	value?: T[];

	/**
	 * The value of the combobox when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: T[];

	/** Event handler called when the value changes. */
	onChange?: (value: T[]) => void;

	/** Whether the combobox allow multiple selection. */
	multiple: true;
}

export type ComboboxRootOptions<Option, OptGroup = never> = (
	| ComboboxSingleSelectionOptions<Option>
	| ComboboxMultipleSelectionOptions<Option>
) &
	Omit<
		ComboboxBaseOptions<Option, OptGroup>,
		"value" | "defaultValue" | "onChange" | "selectionMode"
	>;

export interface ComboboxRootCommonProps<T extends HTMLElement = HTMLElement> {}

export interface ComboboxRootRenderProps
	extends ComboboxRootCommonProps,
		ComboboxBaseRenderProps {}

export type ComboboxRootProps<
	Option,
	OptGroup = never,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ComboboxRootOptions<Option, OptGroup> &
	Partial<ComboboxRootCommonProps<ElementOf<T>>>;

/**
 * A combo box combines a text input with a listbox, allowing users to filter a list of options to items matching a query.
 */
export function ComboboxRoot<
	Option,
	OptGroup = never,
	T extends ValidComponent = "div",
>(props: PolymorphicProps<T, ComboboxRootProps<Option, OptGroup, T>>) {
	const others = omit(
		props as ComboboxRootProps<Option, OptGroup>,
		"value", "defaultValue", "onChange", "multiple",
	);

	const value = createMemo(() => {
		if (props.value != null) {
			return props.multiple ? props.value : [props.value];
		}

		return props.value;
	});

	const defaultValue = createMemo(() => {
		if (props.defaultValue != null) {
			return props.multiple ? props.defaultValue : [props.defaultValue];
		}

		return props.defaultValue;
	});

	const onChange = (value: Option[]) => {
		if (props.multiple) {
			props.onChange?.((value ?? []) as any);
		} else {
			// use `null` as "no value" because `undefined` mean the component is "uncontrolled".
			props.onChange?.((value[0] ?? null) as any); // TODO: maybe return undefined? breaking change!
		}
	};

	return (
		<ComboboxBase<
			Option,
			OptGroup,
			Component<Omit<ComboboxRootRenderProps, keyof ComboboxBaseRenderProps>>
		>
			value={value() as any}
			defaultValue={defaultValue() as any}
			onChange={onChange}
			selectionMode={props.multiple ? "multiple" : "single"}
			{...others}
		/>
	);
}
