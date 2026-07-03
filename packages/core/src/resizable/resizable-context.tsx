/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2023-2025 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/resizable
 */

import { type Accessor, createContext, type Setter, useContext } from "solid-js";
import type {
	ResizablePanelData,
	ResizablePanelInstance,
	ResizableSize,
	ResizeStrategy,
} from "./resizable-lib";

export type { ResizableSize, ResizeStrategy };

export interface ResizableContextValue {
	/** Whether panels are laid out horizontally or vertically. */
	orientation: Accessor<"horizontal" | "vertical">;
	/** Current panel sizes as fractions (0–1). */
	sizes: Accessor<number[]>;
	/** Directly set all panel sizes. */
	setSizes: Setter<number[]>;
	/** Delta used when resizing with arrow keys. */
	keyboardDelta: Accessor<ResizableSize>;
	/** Whether the component manages the global cursor style during resize. */
	handleCursorStyle: Accessor<boolean>;
	/** Resize a panel to a specific size with the given strategy. */
	resize: (panelIndex: number, size: ResizableSize, strategy?: ResizeStrategy) => void;
	/** Collapse a panel (requires `collapsible` on the panel). */
	collapse: (panelIndex: number, strategy?: ResizeStrategy) => void;
	/** Expand a panel (requires `collapsible` on the panel). */
	expand: (panelIndex: number, strategy?: ResizeStrategy) => void;
}

export const ResizableContext = createContext<ResizableContextValue>();

/** Returns the nearest `<Resizable.Root>` context. Throws if called outside one. */
export function useResizableContext(): ResizableContextValue {
	const ctx = useContext(ResizableContext);
	if (!ctx) {
		throw new Error(
			"[kobalte]: `useResizableContext` must be used within a `Resizable.Root`",
		);
	}
	return ctx;
}

/** Internal context — superset with setters and registration hooks used by Panel and Handle. */
export interface ResizableInternalContextValue extends ResizableContextValue {
	rootSize: Accessor<number>;
	panels: Accessor<ResizablePanelInstance[]>;
	registerPanel: (panelData: ResizablePanelData) => ResizablePanelInstance;
	unregisterPanel: (id: string) => void;
	onDrag: (handle: HTMLElement, delta: number, altKey: boolean) => void;
	onDragEnd: () => void;
	onKeyDown: (handle: HTMLElement, event: KeyboardEvent, altKey: boolean) => void;
}

export const ResizableInternalContext =
	createContext<ResizableInternalContextValue>();

export function useResizableInternalContext(): ResizableInternalContextValue {
	const ctx = useContext(ResizableInternalContext);
	if (!ctx) {
		throw new Error(
			"[kobalte]: `useResizableInternalContext` must be used within a `Resizable.Root`",
		);
	}
	return ctx;
}
