import { useContext } from "solid-js";
import {
	CheckboxContext,
	type CheckboxContextValue,
	type CheckboxDataSet,
} from "../checkbox/checkbox-context";

export interface CheckboxGroupItemDataSet extends CheckboxDataSet {}

export interface CheckboxGroupItemContextValue extends CheckboxContextValue {}

export const CheckboxGroupItemContext = CheckboxContext;

export function useCheckboxGroupItemContext() {
	const context = useContext(CheckboxGroupItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useCheckboxGroupItemContext` must be used within a `CheckboxGroup.Item` component",
		);
	}

	return context;
}
