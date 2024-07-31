import {
	type Component,
	type ValidComponent,
	createMemo,
	splitProps,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

import {
	SelectBase,
	type SelectBaseCommonProps,
	type SelectBaseOptions,
	type SelectBaseRenderProps,
} from "./select-base";

export interface SelectSingleSelectionOptions<T> {
	/** The controlled value of the select. */
	value?: T | null;

	/**
	 * The value of the select when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: T;

	/** Event handler called when the value changes. */
	onChange?: (value: T | null) => void;

	/** Whether the select allow multiple selection. */
	multiple?: false;
}

export interface SelectMultipleSelectionOptions<T> {
	/** The controlled value of the select. */
	value?: T[];

	/**
	 * The value of the select when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: T[];

	/** Event handler called when the value changes. */
	onChange?: (value: T[]) => void;

	/** Whether the select allow multiple selection. */
	multiple: true;
}

export type SelectRootOptions<Option, OptGroup = never> = (
	| SelectSingleSelectionOptions<Option>
	| SelectMultipleSelectionOptions<Option>
) &
	Omit<
		SelectBaseOptions<Option, OptGroup>,
		"value" | "defaultValue" | "onChange" | "selectionMode"
	>;

export interface SelectRootCommonProps<T extends HTMLElement = HTMLElement>
	extends SelectBaseCommonProps<T> {}

export interface SelectRootRenderProps
	extends SelectRootCommonProps,
		SelectBaseRenderProps {}

export type SelectRootProps<
	Option,
	OptGroup = never,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SelectRootOptions<Option, OptGroup> &
	Partial<SelectRootCommonProps<ElementOf<T>>>;

/**
 * Displays a list of options for the user to pick from — triggered by a button.
 */
export function SelectRoot<
	Option,
	OptGroup = never,
	T extends ValidComponent = "div",
>(props: PolymorphicProps<T, SelectRootProps<Option, OptGroup, T>>) {
	const [local, others] = splitProps(
		props as SelectRootProps<Option, OptGroup>,
		["value", "defaultValue", "onChange", "multiple"],
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
		<SelectBase<
			Option,
			OptGroup,
			Component<Omit<SelectRootRenderProps, keyof SelectBaseRenderProps>>
		>
			value={value() as any}
			defaultValue={defaultValue() as any}
			onChange={onChange}
			selectionMode={local.multiple ? "multiple" : "single"}
			{...others}
		/>
	);
}
