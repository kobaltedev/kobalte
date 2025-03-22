import { type Accessor, createContext, useContext } from "solid-js";

export interface MenuRadioGroupContextValue<TValue = string> {
	isDisabled: Accessor<boolean | undefined>;
	isSelectedValue: (value: TValue) => boolean;
	setSelectedValue: (value: TValue) => void;
}

export const MenuRadioGroupContext =
	createContext<MenuRadioGroupContextValue<any>>();

export function useMenuRadioGroupContext<TValue = string>() {
	const context = useContext(MenuRadioGroupContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useMenuRadioGroupContext` must be used within a `Menu.RadioGroup` component",
		);
	}

	return context as MenuRadioGroupContextValue<TValue>;
}
