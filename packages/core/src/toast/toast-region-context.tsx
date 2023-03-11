import { Accessor, createContext, Setter, useContext } from "solid-js";

import { ToastConfig, ToastSwipeDirection } from "./types";

export interface ToastRegionContextValue {
  hotkey: Accessor<string[]>;
  duration: Accessor<number>;
  unmountDelay: Accessor<number>;
  swipeDirection: Accessor<ToastSwipeDirection>;
  swipeThreshold: Accessor<number>;
  toasts: Accessor<ToastConfig[]>;
  isInteracting: Accessor<boolean>;
  setIsInteracting: Setter<boolean>;
  removeToast: (id: number) => void;
}

export const ToastRegionContext = createContext<ToastRegionContextValue>();

export function useToastRegionContext() {
  const context = useContext(ToastRegionContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useToastRegionContext` must be used within a `Toast.Region` component"
    );
  }

  return context;
}
