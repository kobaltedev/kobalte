import type { ValidComponent } from "@solidjs/web";
import { type Component, createMemo, omit } from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	ToggleGroupBase,
	type ToggleGroupBaseOptions,
	type ToggleGroupBaseRenderProps,
} from "./toggle-group-base";

export interface ToggleGroupSingleOptions {
	/** The controlled value of the toggle group. */
	value?: string | null;

	/**
	 * The value of the select when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: string;

	/** Event handler called when the value changes. */
	onChange?: (value: string | null) => void;

	/** Whether the toggle group allow multiple selection. */
	multiple?: false;
}

export interface ToggleGroupMultipleOptions {
	/** The controlled value of the toggle group select. */
	value?: string[];

	/**
	 * The value of the select when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: string[];

	/** Event handler called when the value changes. */
	onChange?: (value: string[]) => void;

	/** Whether the toggle group allow multiple selection. */
	multiple: true;
}

export type ToggleGroupRootOptions = (
	| ToggleGroupSingleOptions
	| ToggleGroupMultipleOptions
) &
	Omit<
		ToggleGroupBaseOptions,
		"value" | "defaultValue" | "onChange" | "selectionMode"
	>;

export interface ToggleGroupRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface ToggleGroupRootRenderProps
	extends ToggleGroupRootCommonProps {}

export type ToggleGroupRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToggleGroupRootOptions & Partial<ToggleGroupRootCommonProps<ElementOf<T>>>;

export function ToggleGroup<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ToggleGroupRootProps<T>>,
) {
	const others = omit(
		props as ToggleGroupRootProps,
		"value",
		"defaultValue",
		"onChange",
		"multiple",
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

	const onChange = (value: string[]) => {
		if (props.multiple) {
			props.onChange?.(value as any);
		} else {
			// use `null` as "no value" because `undefined` mean the component is "uncontrolled".
			props.onChange?.((value[0] ?? null) as any);
		}
	};

	return (
		<ToggleGroupBase<
			Component<
				Omit<ToggleGroupRootRenderProps, keyof ToggleGroupBaseRenderProps>
			>
		>
			value={value() as any}
			defaultValue={defaultValue() as any}
			onChange={onChange}
			selectionMode={props.multiple ? "multiple" : "single"}
			{...others}
		/>
	);
}
