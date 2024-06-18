import { type Accessor, createContext, useContext } from "solid-js";

import type { ToastConfig, ToastSwipeDirection } from "./types";

export interface ToastRegionContextValue {
	isPaused: Accessor<boolean>;
	toasts: Accessor<ToastConfig[]>;
	hotkey: Accessor<string[]>;
	duration: Accessor<number>;
	swipeDirection: Accessor<ToastSwipeDirection>;
	swipeThreshold: Accessor<number>;
	pauseOnInteraction: Accessor<boolean>;
	pauseOnPageIdle: Accessor<boolean>;
	pauseAllTimer: () => void;
	resumeAllTimer: () => void;
	generateId: (part: string) => string;
}

export const ToastRegionContext = createContext<ToastRegionContextValue>();

export function useToastRegionContext() {
	const context = useContext(ToastRegionContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useToastRegionContext` must be used within a `Toast.Region` component",
		);
	}

	return context;
}
