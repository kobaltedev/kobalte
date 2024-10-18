import { type Accessor, createContext, useContext } from "solid-js";

export interface CheckboxGroupContextValue {
	ariaDescribedBy: Accessor<string | undefined>;
	isSelectedValue: (value: string) => boolean;
	setSelectedValue: (value: string) => void;
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
