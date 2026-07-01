import { type Accessor, createContext, useContext } from "solid-js";

export interface CheckboxGroupContextValue {
	ariaDescribedBy: Accessor<string | undefined>;
	isValueSelected: (value: string) => boolean;
	handleValue: (value: string) => void;
	generateId: (part: string) => string;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue>();

export function useCheckboxGroupContext() {
	const context = useContext(CheckboxGroupContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useCheckboxGroupContext` must be used within a `CheckboxGroup` component",
		);
	}

	return context;
}
