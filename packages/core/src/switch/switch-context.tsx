import { type Accessor, createContext, useContext } from "solid-js";

export interface SwitchDataSet {
	"data-checked": string | undefined;
}

export interface SwitchContextValue {
	value: Accessor<string>;
	dataset: Accessor<SwitchDataSet>;
	checked: Accessor<boolean>;
	inputRef: Accessor<HTMLInputElement | undefined>;
	generateId: (part: string) => string;
	toggle: () => void;
	setIsChecked: (isChecked: boolean) => void;
	setIsFocused: (isFocused: boolean) => void;
	setInputRef: (el: HTMLInputElement) => void;
}

export const SwitchContext = createContext<SwitchContextValue>();

export function useSwitchContext() {
	const context = useContext(SwitchContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useSwitchContext` must be used within a `Switch` component",
		);
	}

	return context;
}
