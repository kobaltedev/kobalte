/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/drawer
 */

import {
	type Accessor,
	createContext,
	type Setter,
	useContext,
} from "solid-js";
import type { DrawerSide, DrawerSize } from "./drawer-lib";

export type { DrawerSide, DrawerSize };

export type DrawerTransitionState = "opening" | "closing" | "snapping" | null;

export interface DrawerContextValue {
	/** Side of the viewport the drawer appears from. */
	side: Accessor<DrawerSide>;
	/** Snap points (0–1 fractions or `Npx` strings). */
	snapPoints: Accessor<DrawerSize[]>;
	/** Break points between snap points. */
	breakPoints: Accessor<(DrawerSize | null)[]>;
	/** Snap point used when the drawer opens. */
	defaultSnapPoint: Accessor<DrawerSize>;
	/** The currently active snap point. */
	activeSnapPoint: Accessor<DrawerSize>;
	/** Programmatically change the active snap point. */
	setActiveSnapPoint: (snapPoint: DrawerSize) => void;
	/** True while the user is dragging the drawer. */
	isDragging: Accessor<boolean>;
	/** True while the drawer is transitioning between states. */
	isTransitioning: Accessor<boolean>;
	/** Current transition state, or null when idle. */
	transitionState: Accessor<DrawerTransitionState>;
	/** 0 = fully closed, 1 = fully open (at defaultSnapPoint). Can exceed 1 during overdrag. */
	openPercentage: Accessor<number>;
	/** Current translate offset in px. 0 = open, drawerSize = closed. */
	translate: Accessor<number>;
	/** Whether to allow skipping snap points via velocity. */
	allowSkippingSnapPoints: Accessor<boolean>;
	/** Whether dragging on scrollable elements is handled. */
	handleScrollableElements: Accessor<boolean>;
	/** Milliseconds before velocity cache resets. */
	velocityCacheReset: Accessor<number>;
}

export const DrawerContext = createContext<DrawerContextValue>();

export function useDrawerContext(): DrawerContextValue {
	const ctx = useContext(DrawerContext);
	if (!ctx) {
		throw new Error(
			"[kobalte]: `useDrawerContext` must be used within a `Drawer.Root`",
		);
	}
	return ctx;
}

/** Internal context — superset of DrawerContextValue with setters used by DrawerContent. */
export interface DrawerInternalContextValue extends DrawerContextValue {
	setIsDragging: (v: boolean) => void;
	setTranslateDrag: Setter<number | null>;
	setTransitionState: Setter<DrawerTransitionState>;
	drawerSize: Accessor<number>;
	setDrawerSize: (v: number) => void;
	dampFunction: (distance: number) => number;
	velocityFunction: (distance: number, time: number) => number;
	resolvedSnapPoints: Accessor<
		Array<{
			value: DrawerSize;
			offset: number;
			upperBreakPoint?: number;
			lowerBreakPoint?: number;
		}>
	>;
	closeDrawer: () => void;
}

export const DrawerInternalContext =
	createContext<DrawerInternalContextValue>();

export function useDrawerInternalContext(): DrawerInternalContextValue {
	const ctx = useContext(DrawerInternalContext);
	if (!ctx) {
		throw new Error(
			"[kobalte]: `useDrawerInternalContext` must be used within a `Drawer.Root`",
		);
	}
	return ctx;
}
