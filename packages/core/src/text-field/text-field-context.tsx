import { Accessor, createContext, JSX, useContext } from "solid-js";

export interface TextFieldDataSet {
  "data-hover": string | undefined;
  "data-focus": string | undefined;
  "data-focus-visible": string | undefined;
}

export interface TextFieldContextValue {
  dataset: Accessor<TextFieldDataSet>;
  value: Accessor<string | undefined>;
  generateId: (part: string) => string;
  setIsFocused: (isFocused: boolean) => void;
  setIsFocusVisible: (isFocusVisible: boolean) => void;
  onInput: JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
}

export const TextFieldContext = createContext<TextFieldContextValue>();

export function useTextFieldContext() {
  const context = useContext(TextFieldContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useTextFieldContext` must be used within a `TextField` component");
  }

  return context;
}
