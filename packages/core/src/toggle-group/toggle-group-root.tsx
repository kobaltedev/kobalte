import { Component, ValidComponent, createMemo, splitProps } from "solid-js";
import { PolymorphicProps } from "../polymorphic";
import {
	ToggleGroupBase,
	ToggleGroupBaseOptions,
	ToggleGroupBaseRenderProps,
} from "./toggle-group-base";

export interface ToggleGroupSingleOptions {
	/** The controlled value of the toggle group. */
	value?: string;

	/**
	 * The value of the select when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: string;

	/** Event handler called when the value changes. */
	onChange?: (value: string) => void;

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

export interface ToggleGroupRootCommonProps {}

export interface ToggleGroupRootRenderProps
	extends ToggleGroupRootCommonProps {}

export type ToggleGroupRootProps = ToggleGroupRootOptions &
	Partial<ToggleGroupRootCommonProps>;

export function ToggleGroup<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ToggleGroupRootProps>,
) {
	const [local, others] = splitProps(props as ToggleGroupRootProps, [
		"value",
		"defaultValue",
		"onChange",
		"multiple",
	]);

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

	const onChange = (value: string[]) => {
		if (local.multiple) {
			local.onChange?.(value as any);
		} else {
			// use `null` as "no value" because `undefined` mean the component is "uncontrolled".
			local.onChange?.((value[0] ?? null) as any);
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
			selectionMode={local.multiple ? "multiple" : "single"}
			{...others}
		/>
	);
}
