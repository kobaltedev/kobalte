import type { ValidationState } from "@kobalte/utils";
import { type Accessor, createContext, useContext } from "solid-js";

export interface FormControlDataSet {
	"data-valid": string | undefined;
	"data-invalid": string | undefined;
	"data-required": string | undefined;
	"data-disabled": string | undefined;
	"data-readonly": string | undefined;
}

export interface FormControlContextValue {
	name: Accessor<string>;
	dataset: Accessor<FormControlDataSet>;
	validationState: Accessor<ValidationState | undefined>;
	isRequired: Accessor<boolean | undefined>;
	isDisabled: Accessor<boolean | undefined>;
	isReadOnly: Accessor<boolean | undefined>;
	labelId: Accessor<string | undefined>;
	fieldId: Accessor<string | undefined>;
	descriptionId: Accessor<string | undefined>;
	errorMessageId: Accessor<string | undefined>;
	getAriaLabelledBy: (
		fieldId: string | undefined,
		fieldAriaLabel: string | undefined,
		fieldAriaLabelledBy: string | undefined,
	) => string | undefined;
	getAriaDescribedBy: (
		fieldAriaDescribedBy: string | undefined,
	) => string | undefined;
	generateId: (part: string) => string;
	registerLabel: (id: string) => () => void;
	registerField: (id: string) => () => void;
	registerDescription: (id: string) => () => void;
	registerErrorMessage: (id: string) => () => void;
}

export const FormControlContext = createContext<FormControlContextValue>();

export function useFormControlContext() {
	const context = useContext(FormControlContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component",
		);
	}

	return context;
}
