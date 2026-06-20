import {
	type Component,
	type ValidComponent,
	createMemo,
	omit,
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
	const others = omit(
		props as SelectRootProps<Option, OptGroup>,
		"value", "defaultValue", "onChange", "multiple",
	);

	const _props = props as SelectRootProps<Option, OptGroup>;

	const value = createMemo(() => {
		if (_props.value != null) {
			return _props.multiple ? _props.value : [_props.value];
		}

		return _props.value;
	});

	const defaultValue = createMemo(() => {
		if (_props.defaultValue != null) {
			return _props.multiple ? _props.defaultValue : [_props.defaultValue];
		}

		return _props.defaultValue;
	});

	const onChange = (value: Option[]) => {
		if (_props.multiple) {
			_props.onChange?.((value ?? []) as any);
		} else {
			// use `null` as "no value" because `undefined` mean the component is "uncontrolled".
			_props.onChange?.((value[0] ?? null) as any); // TODO: maybe return undefined? breaking change!
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
			selectionMode={_props.multiple ? "multiple" : "single"}
			{...others}
		/>
	);
}
