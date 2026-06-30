/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2023-2025 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/resizable
 */

import { type Accessor, createContext, useContext } from "solid-js";
import type { ResizableSize, ResizeStrategy } from "./resizable-lib";

export interface ResizablePanelContextValue {
	/** Current size of the panel as a fraction (0–1). */
	size: Accessor<number>;
	/** Minimum allowed size. */
	minSize: Accessor<ResizableSize>;
	/** Maximum allowed size. */
	maxSize: Accessor<ResizableSize>;
	/** Whether the panel can be fully collapsed. */
	collapsible: Accessor<boolean>;
	/** Size the panel collapses to. */
	collapsedSize: Accessor<ResizableSize>;
	/** Overdrag threshold required to trigger collapse. */
	collapseThreshold: Accessor<ResizableSize>;
	/** Whether the panel is currently collapsed. */
	collapsed: Accessor<boolean>;
	/** Resize this panel to a specific size. */
	resize: (size: ResizableSize, strategy?: ResizeStrategy) => void;
	/** Collapse this panel. */
	collapse: (strategy?: ResizeStrategy) => void;
	/** Expand this panel. */
	expand: (strategy?: ResizeStrategy) => void;
	/** The HTML `id` attribute of the panel element. */
	panelId: Accessor<string>;
}

export const ResizablePanelContext = createContext<ResizablePanelContextValue>();

/** Returns the nearest `<Resizable.Panel>` context. Throws if called outside one. */
export function useResizablePanelContext(): ResizablePanelContextValue {
	const ctx = useContext(ResizablePanelContext);
	if (!ctx) {
		throw new Error(
			"[kobalte]: `useResizablePanelContext` must be used within a `Resizable.Panel`",
		);
	}
	return ctx;
}
