import { type JSX, createContext, useContext } from "solid-js";

export interface ColorFieldContextValue {
	onBlur: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent>;
}

export const ColorFieldContext = createContext<ColorFieldContextValue>();

export function useColorFieldContext() {
	const context = useContext(ColorFieldContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useColorFieldContext` must be used within a `ColorField` component",
		);
	}

	return context;
}
