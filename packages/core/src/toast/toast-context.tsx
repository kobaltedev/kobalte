import { Accessor, createContext, useContext } from "solid-js";

export interface ToastContextValue {
  close: () => void;
  duration: Accessor<number>;
  isPersistent: Accessor<boolean>;
  closeTimerStartTime: Accessor<number>;
  generateId: (part: string) => string;
  registerTitleId: (id: string) => () => void;
  registerDescriptionId: (id: string) => () => void;
}

export const ToastContext = createContext<ToastContextValue>();

export function useToastContext() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useToastContext` must be used within a `Toast.Root` component");
  }

  return context;
}
