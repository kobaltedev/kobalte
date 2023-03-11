import { createContext, useContext } from "solid-js";

export interface ToastContextValue {}

export const ToastContext = createContext<ToastContextValue>();

export function useToastContext() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useToastContext` must be used within a `Toast.Root` component");
  }

  return context;
}
