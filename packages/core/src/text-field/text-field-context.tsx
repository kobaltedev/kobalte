import { type Accessor, type JSX, createContext, useContext } from "solid-js";

export interface TextFieldContextValue {
	value: Accessor<string | undefined>;
	generateId: (part: string) => string;
	onInput: JSX.EventHandlerUnion<
		HTMLInputElement | HTMLTextAreaElement,
		InputEvent
	>;
}

export const TextFieldContext = createContext<TextFieldContextValue>();

export function useTextFieldContext() {
	const context = useContext(TextFieldContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useTextFieldContext` must be used within a `TextField` component",
		);
	}

	return context;
}
