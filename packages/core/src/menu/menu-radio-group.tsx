/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */

import { mergeDefaultProps } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createUniqueId,
	splitProps,
} from "solid-js";

import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { createControllableSignal } from "../primitives";
import {
	MenuGroup,
	type MenuGroupCommonProps,
	type MenuGroupRenderProps,
} from "./menu-group";
import {
	MenuRadioGroupContext,
	type MenuRadioGroupContextValue,
} from "./menu-radio-group-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuRadioGroupOptions {
	/** The controlled value of the item radio to check. */
	value?: string;

	/**
	 * The value of the item radio that should be checked when initially rendered.
	 * Useful when you do not need to control the state of the menu radio group.
	 */
	defaultValue?: string;

	/** Event handler called when the value changes. */
	onChange?: (value: string) => void;

	/** Whether the menu radio group is disabled. */
	disabled?: boolean;
}

export interface MenuRadioGroupCommonProps<T extends HTMLElement = HTMLElement>
	extends MenuGroupCommonProps<T> {
	id: string;
}

export interface MenuRadioGroupRenderProps
	extends MenuRadioGroupCommonProps,
		MenuGroupRenderProps {}

export type MenuRadioGroupProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuRadioGroupOptions & Partial<MenuRadioGroupCommonProps<ElementOf<T>>>;

/**
 * A container used to group multiple `Menu.RadioItem`s and manage the selection.
 */
export function MenuRadioGroup<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuRadioGroupProps<T>>,
) {
	const rootContext = useMenuRootContext();

	const defaultId = rootContext.generateId(`radiogroup-${createUniqueId()}`);

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as MenuRadioGroupProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"value",
		"defaultValue",
		"onChange",
		"disabled",
	]);

	const [selected, setSelected] = createControllableSignal<string>({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: (value) => local.onChange?.(value),
	});

	const context: MenuRadioGroupContextValue = {
		isDisabled: () => local.disabled,
		isSelectedValue: (value: string) => value === selected(),
		setSelectedValue: setSelected,
	};

	return (
		<MenuRadioGroupContext.Provider value={context}>
			<MenuGroup<
				Component<Omit<MenuRadioGroupRenderProps, keyof MenuGroupRenderProps>>
			>
				{...others}
			/>
		</MenuRadioGroupContext.Provider>
	);
}
