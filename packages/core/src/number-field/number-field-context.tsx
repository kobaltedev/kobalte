import {
	type Accessor,
	type JSX,
	Setter,
	createContext,
	useContext,
} from "solid-js";
import type { SpinButtonIntlTranslations } from "../spin-button/spin-button.intl";

export interface NumberFieldContextValue {
	value: Accessor<number | string | undefined>;
	setValue: (value: number | string) => void;
	rawValue: Accessor<number>;
	generateId: (part: string) => string;
	formatNumber: (number: number) => string;
	format: () => void;
	onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
	textValue: Accessor<string | undefined>;
	minValue: Accessor<number>;
	maxValue: Accessor<number>;
	step: Accessor<number>;
	largeStep: Accessor<number>;
	changeOnWheel: Accessor<boolean>;
	translations: Accessor<SpinButtonIntlTranslations | undefined>;
	inputRef: Accessor<HTMLInputElement | undefined>;
	setInputRef: (el: HTMLInputElement) => void;
	hiddenInputRef: Accessor<HTMLInputElement | undefined>;
	setHiddenInputRef: (el: HTMLInputElement) => void;
	varyValue: (offset: number) => void;
}

export const NumberFieldContext = createContext<NumberFieldContextValue>();

export function useNumberFieldContext() {
	const context = useContext(NumberFieldContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useNumberFieldContext` must be used within a `NumberField` component",
		);
	}

	return context;
}
