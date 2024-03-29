import { OverrideComponentProps } from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";
import { ToggleGroupBase, ToggleGroupBaseOptions } from "./toggle-group-base";

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

export type ToggleGroupRootProps = OverrideComponentProps<
	"div",
	ToggleGroupRootOptions
>;

export const ToggleGroup = (props: ToggleGroupRootProps) => {
	const [local, others] = splitProps(props, [
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
		<ToggleGroupBase
			value={value() as any}
			defaultValue={defaultValue() as any}
			onChange={onChange}
			selectionMode={local.multiple ? "multiple" : "single"}
			{...others}
		/>
	);
};
