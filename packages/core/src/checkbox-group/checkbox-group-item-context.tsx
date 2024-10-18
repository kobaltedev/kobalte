import { Accessor, createContext, useContext } from "solid-js";
import {
	type CheckboxContextValue,
	type CheckboxDataSet,
} from "../checkbox/checkbox-context";

export interface CheckboxGroupItemDataSet extends CheckboxDataSet {
	"data-disabled": string | undefined
}

export interface CheckboxGroupItemContextValue extends CheckboxContextValue {
	isDisabled: Accessor<boolean>;
	registerInput: (id: string) => () => void;
	registerLabel: (id: string) => () => void;
	registerDescription: (id: string) => () => void;
	inputId: Accessor<string | undefined>;
	labelId: Accessor<string | undefined>;
	descriptionId: Accessor<string | undefined>;
}

export const CheckboxGroupItemContext = createContext<CheckboxGroupItemContextValue>();;

export function useCheckboxGroupItemContext() {
	const context = useContext(CheckboxGroupItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useCheckboxGroupItemContext` must be used within a `CheckboxGroup.Item` component",
		);
	}

	return context;
}
