import { type Accessor, createContext, useContext } from "solid-js";

export interface MenuRadioGroupContextValue {
	isDisabled: Accessor<boolean | undefined>;
	isSelectedValue: (value: string) => boolean;
	setSelectedValue: (value: string) => void;
}

export const MenuRadioGroupContext =
	createContext<MenuRadioGroupContextValue>();

export function useMenuRadioGroupContext() {
	const context = useContext(MenuRadioGroupContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useMenuRadioGroupContext` must be used within a `Menu.RadioGroup` component",
		);
	}

	return context;
}
