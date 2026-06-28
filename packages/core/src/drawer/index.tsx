/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/drawer
 */

// Sub-components shared with Dialog (identical behaviour, just re-exported under Drawer names).
import {
	CloseButton,
	Description,
	type DialogCloseButtonCommonProps as DrawerCloseButtonCommonProps,
	type DialogCloseButtonOptions as DrawerCloseButtonOptions,
	type DialogCloseButtonProps as DrawerCloseButtonProps,
	type DialogCloseButtonRenderProps as DrawerCloseButtonRenderProps,
	type DialogDescriptionCommonProps as DrawerDescriptionCommonProps,
	type DialogDescriptionOptions as DrawerDescriptionOptions,
	type DialogDescriptionProps as DrawerDescriptionProps,
	type DialogDescriptionRenderProps as DrawerDescriptionRenderProps,
	type DialogPortalProps as DrawerPortalProps,
	type DialogTitleCommonProps as DrawerTitleCommonProps,
	type DialogTitleOptions as DrawerTitleOptions,
	type DialogTitleProps as DrawerTitleProps,
	type DialogTitleRenderProps as DrawerTitleRenderProps,
	type DialogTriggerCommonProps as DrawerTriggerCommonProps,
	type DialogTriggerOptions as DrawerTriggerOptions,
	type DialogTriggerProps as DrawerTriggerProps,
	type DialogTriggerRenderProps as DrawerTriggerRenderProps,
	Portal,
	Title,
	Trigger,
} from "../dialog";

// Drawer-specific components
import {
	DrawerContent as Content,
	type DrawerContentCommonProps,
	type DrawerContentOptions,
	type DrawerContentProps,
	type DrawerContentRenderProps,
} from "./drawer-content";
import {
	type DrawerContextValue,
	type DrawerInternalContextValue,
	type DrawerTransitionState,
	useDrawerContext as useContext,
} from "./drawer-context";
import type { DrawerSide, DrawerSize } from "./drawer-lib";
import {
	type DrawerOverlayCommonProps,
	type DrawerOverlayOptions,
	type DrawerOverlayProps,
	type DrawerOverlayRenderProps,
	DrawerOverlay as Overlay,
} from "./drawer-overlay";
import {
	type DrawerRootOptions,
	type DrawerRootProps,
	DrawerRoot as Root,
} from "./drawer-root";

export type {
	// Shared from Dialog
	DrawerCloseButtonCommonProps,
	DrawerCloseButtonOptions,
	DrawerCloseButtonProps,
	DrawerCloseButtonRenderProps,
	// Content
	DrawerContentCommonProps,
	DrawerContentOptions,
	DrawerContentProps,
	DrawerContentRenderProps,
	// Context
	DrawerContextValue,
	DrawerDescriptionCommonProps,
	DrawerDescriptionOptions,
	DrawerDescriptionProps,
	DrawerDescriptionRenderProps,
	DrawerInternalContextValue,
	// Overlay
	DrawerOverlayCommonProps,
	DrawerOverlayOptions,
	DrawerOverlayProps,
	DrawerOverlayRenderProps,
	DrawerPortalProps,
	// Root
	DrawerRootOptions,
	DrawerRootProps,
	// Primitives
	DrawerSide,
	DrawerSize,
	DrawerTitleCommonProps,
	DrawerTitleOptions,
	DrawerTitleProps,
	DrawerTitleRenderProps,
	DrawerTransitionState,
	DrawerTriggerCommonProps,
	DrawerTriggerOptions,
	DrawerTriggerProps,
	DrawerTriggerRenderProps,
};

export {
	CloseButton,
	Content,
	Description,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger,
	useContext,
};

export const Drawer = Object.assign(Root, {
	CloseButton,
	Content,
	Description,
	Overlay,
	Portal,
	Title,
	Trigger,
	useContext,
});
