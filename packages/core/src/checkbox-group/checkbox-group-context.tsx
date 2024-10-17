import { type Accessor, createContext, useContext } from "solid-js";
import type { CheckboxGroupItemValue } from "./checkbox-group-root";

export interface CheckboxGroupContextValue {
	ariaDescribedBy: Accessor<string | undefined>;
	isSelectedValue: (value: CheckboxGroupItemValue) => boolean;
	setSelectedValue: (value: CheckboxGroupItemValue) => void;
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
