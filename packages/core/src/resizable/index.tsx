/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2023-2025 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/resizable
 */

export {
	type ResizableContextValue,
	type ResizableInternalContextValue,
	type ResizableSize,
	type ResizeStrategy,
	useResizableContext as useContext,
} from "./resizable-context";

export {
	type ResizablePanelContextValue,
	useResizablePanelContext as usePanelContext,
} from "./resizable-panel-context";

export {
	ResizableHandle as Handle,
	type ResizableHandleCommonProps as HandleCommonProps,
	type ResizableHandleOptions as HandleOptions,
	type ResizableHandleProps as HandleProps,
	type ResizableHandleRenderProps as HandleRenderProps,
} from "./resizable-handle";

export {
	ResizablePanel as Panel,
	type ResizablePanelChildrenProps as PanelChildrenProps,
	type ResizablePanelCommonProps as PanelCommonProps,
	type ResizablePanelOptions as PanelOptions,
	type ResizablePanelProps as PanelProps,
	type ResizablePanelRenderProps as PanelRenderProps,
} from "./resizable-panel";

export {
	ResizableRoot as Root,
	type ResizableRootChildrenProps as RootChildrenProps,
	type ResizableRootCommonProps as RootCommonProps,
	type ResizableRootOptions as RootOptions,
	type ResizableRootProps as RootProps,
	type ResizableRootRenderProps as RootRenderProps,
} from "./resizable-root";

import { ResizableHandle as Handle } from "./resizable-handle";
import { ResizablePanel as Panel } from "./resizable-panel";
import {
	ResizableRoot as Root,
} from "./resizable-root";
import { useResizableContext as useContext } from "./resizable-context";
import { useResizablePanelContext as usePanelContext } from "./resizable-panel-context";

export const Resizable = Object.assign(Root, {
	Handle,
	Panel,
	useContext,
	usePanelContext,
});
