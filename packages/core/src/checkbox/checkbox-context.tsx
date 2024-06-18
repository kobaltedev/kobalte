import { type Accessor, createContext, useContext } from "solid-js";

export interface CheckboxDataSet {
	"data-checked": string | undefined;
	"data-indeterminate": string | undefined;
}

export interface CheckboxContextValue {
	value: Accessor<string>;
	dataset: Accessor<CheckboxDataSet>;
	checked: Accessor<boolean>;
	indeterminate: Accessor<boolean>;
	inputRef: Accessor<HTMLInputElement | undefined>;
	generateId: (part: string) => string;
	toggle: () => void;
	setIsChecked: (isChecked: boolean) => void;
	setIsFocused: (isFocused: boolean) => void;
	setInputRef: (el: HTMLInputElement) => void;
}

export const CheckboxContext = createContext<CheckboxContextValue>();

export function useCheckboxContext() {
	const context = useContext(CheckboxContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useCheckboxContext` must be used within a `Checkbox` component",
		);
	}

	return context;
}
