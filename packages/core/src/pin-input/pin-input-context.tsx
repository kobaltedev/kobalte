import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";
import type { FormControlDataSet } from "../form-control";
import type { CollectionItemWithRef } from "../primitives";
import type { PinInputIntlTranslations } from "./pin-input.intl";

export interface PinInputDataSet extends FormControlDataSet {
	"data-complete": string | undefined;
}

export interface PinInputContextValue {
	dataset: Accessor<PinInputDataSet>;
	value: Accessor<string[]>;
	setValue: Setter<string[]>;
	mask: Accessor<boolean | undefined>;
	otp: Accessor<boolean | undefined>;
	pattern: Accessor<string | undefined>;
	placeholder: Accessor<string>;
	type: Accessor<"numeric" | "alphabetic" | "alphanumeric">;
	focusedIndex: Accessor<number>;
	setFocusedIndex: Setter<number>;
	inputs: Accessor<CollectionItemWithRef[]>;
	setInputs: Setter<CollectionItemWithRef[]>;
	translations: Accessor<PinInputIntlTranslations>;
}

export const PinInputContext = createContext<PinInputContextValue>();

export function usePinInputContext() {
	const context = useContext(PinInputContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `usePinInputContext` must be used within a `PinInput` component",
		);
	}

	return context;
}
