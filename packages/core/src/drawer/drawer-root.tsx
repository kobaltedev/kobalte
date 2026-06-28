/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/drawer
 */

import { mergeDefaultProps } from "@kobalte/utils";
import {
	createEffect,
	createMemo,
	createSignal,
	omit,
	type ParentProps,
	type Setter,
	untrack,
} from "solid-js";
import { DialogRoot, type DialogRootOptions } from "../dialog/dialog-root";
import { createControllableSignal, createDisclosureState } from "../primitives";
import {
	DrawerContext,
	type DrawerContextValue,
	DrawerInternalContext,
	type DrawerInternalContextValue,
	type DrawerTransitionState,
} from "./drawer-context";
import {
	afterPaint,
	type DrawerSide,
	type DrawerSize,
	resolveSnapPoint,
} from "./drawer-lib";

export interface DrawerRootOptions
	extends Omit<DialogRootOptions, "forceMount"> {
	/**
	 * Side of the viewport the drawer appears from.
	 * @defaultValue "bottom"
	 */
	side?: DrawerSide;

	/**
	 * Snap points the drawer can settle at. Each value is either a fraction
	 * of the drawer size (0–1) or a pixel string like `"200px"`.
	 * `0` = fully closed, `1` = fully open.
	 * @defaultValue `[0, 1]`
	 */
	snapPoints?: DrawerSize[];

	/**
	 * Custom break points between snap points. Length must equal
	 * `snapPoints.length - 1`. Pass `null` to keep the default midpoint.
	 */
	breakPoints?: (DrawerSize | null)[];

	/**
	 * Snap point to use when the drawer first opens.
	 * @defaultValue `1`
	 */
	defaultSnapPoint?: DrawerSize;

	/** Controlled active snap point. */
	activeSnapPoint?: DrawerSize;

	/** Fired when the active snap point changes. */
	onActiveSnapPointChange?: (snapPoint: DrawerSize) => void;

	/**
	 * Damping function applied when the user drags past the last snap point.
	 * @defaultValue `(d) => 6 * Math.log(d + 1)`
	 */
	dampFunction?: (distance: number) => number;

	/**
	 * Velocity modifier used to determine the target snap point on release.
	 * @defaultValue velocity = distance / time, clamped to 1 when |v| < 1
	 */
	velocityFunction?: (distance: number, time: number) => number;

	/**
	 * Milliseconds after which the cached drag distance resets for velocity.
	 * @defaultValue `200`
	 */
	velocityCacheReset?: number;

	/**
	 * Whether high-velocity drags can skip intermediate snap points.
	 * @defaultValue `true`
	 */
	allowSkippingSnapPoints?: boolean;

	/**
	 * Whether to prevent drawer drag from conflicting with scrollable children.
	 * @defaultValue `true`
	 */
	handleScrollableElements?: boolean;
}

export interface DrawerRootProps extends ParentProps<DrawerRootOptions> {}

/**
 * A panel that slides in from the edge of the screen with drag-to-dismiss
 * and snap-point support. All `Dialog.Root` props are also accepted.
 *
 * **Credit:** Snap-point architecture and drag math are adapted from
 * [corvu/drawer](https://github.com/corvudev/corvu/tree/main/packages/drawer)
 * by Jasmin Noetzli (MIT).
 */
export function DrawerRoot(props: DrawerRootProps) {
	const mergedProps = mergeDefaultProps(
		{
			side: "bottom" as DrawerSide,
			snapPoints: [0, 1] as DrawerSize[],
			breakPoints: [null] as (DrawerSize | null)[],
			defaultSnapPoint: 1 as DrawerSize,
			dampFunction: (d: number) => 6 * Math.log(d + 1),
			velocityFunction: (d: number, t: number) => {
				const v = d / t;
				return v < 1 && v > -1 ? 1 : v;
			},
			velocityCacheReset: 200,
			allowSkippingSnapPoints: true,
			handleScrollableElements: true,
			modal: true,
		},
		props as DrawerRootOptions & { children: any },
	);

	// Logical open state — what the user controls via props / trigger clicks.
	const disclosure = createDisclosureState({
		open: () => mergedProps.open,
		defaultOpen: () => mergedProps.defaultOpen,
		onOpenChange: (isOpen) => mergedProps.onOpenChange?.(isOpen),
	});

	// transitionAwareOpen drives DialogRoot. It stays `true` during the closing
	// animation so the content remains mounted until the slide-out finishes.
	const initiallyOpen = untrack(() => disclosure.isOpen());
	const [transitionAwareOpen, setTransitionAwareOpen] =
		createSignal(initiallyOpen);

	// Active snap point — controllable, default = fully open (1) if initially open.
	const [activeSnapPoint, _setActiveSnapPointRaw] =
		createControllableSignal<DrawerSize>({
			value: () => mergedProps.activeSnapPoint,
			defaultValue: () =>
				initiallyOpen ? (mergedProps.defaultSnapPoint ?? 1) : 0,
			onChange: mergedProps.onActiveSnapPointChange,
		});

	const setActiveSnapPoint = (sp: DrawerSize) =>
		_setActiveSnapPointRaw(sp as any);

	const [isDragging, setIsDragging] = createSignal(false);
	const [transitionState, setTransitionState] =
		createSignal<DrawerTransitionState>(null);

	// translateDrag: non-null only while user is dragging. Overrides activeSnapPoint.
	const [translateDrag, setTranslateDrag] = createSignal<number | null>(null);

	// Drawer's measured size in px (set by DrawerContent via ResizeObserver).
	const [drawerSize, setDrawerSize] = createSignal(0);

	const resolvedSnapPoints = createMemo(() =>
		mergedProps.snapPoints.map((sp, i) =>
			resolveSnapPoint(sp, drawerSize(), i, mergedProps.breakPoints),
		),
	);

	const resolvedActive = createMemo(() =>
		resolveSnapPoint(activeSnapPoint() ?? 0, drawerSize()),
	);

	// During drag: translateDrag wins. Otherwise tracks activeSnapPoint.
	const translate = createMemo(
		() => translateDrag() ?? resolvedActive().offset,
	);

	const openPercentage = createMemo(() => {
		const size = drawerSize();
		return size === 0 ? 0 : (size - translate()) / size;
	});

	// Called by DrawerContent's onTransitionEnd when the closing animation finishes.
	const closeDrawer = () => {
		setTransitionAwareOpen(false);
		setTransitionState(null);
	};

	// State machine: react to logical open-state changes.
	// Skip the very first apply (we already set the correct initial state above).
	let isFirstApply = true;
	createEffect(
		() => disclosure.isOpen(),
		(isOpen) => {
			if (isFirstApply) {
				isFirstApply = false;
				return;
			}
			if (isOpen) {
				setActiveSnapPoint(0); // position off-screen before mounting
				setTransitionAwareOpen(true);
				afterPaint(() => {
					setTransitionState("opening");
					setActiveSnapPoint(mergedProps.defaultSnapPoint ?? 1);
				});
			} else {
				// Animate out, then unmount via closeDrawer() in onTransitionEnd.
				setTransitionState("closing");
				setActiveSnapPoint(0);
			}
		},
	);

	// The dialog's onOpenChange (escape, click-outside, trigger, close-button)
	// feeds back into our logical disclosure state.
	const handleDialogOpenChange = (isOpen: boolean) => {
		if (isOpen) disclosure.open();
		else disclosure.close();
	};

	const dialogProps = omit(
		mergedProps,
		"side",
		"snapPoints",
		"breakPoints",
		"defaultSnapPoint",
		"activeSnapPoint",
		"onActiveSnapPointChange",
		"dampFunction",
		"velocityFunction",
		"velocityCacheReset",
		"allowSkippingSnapPoints",
		"handleScrollableElements",
	) as DialogRootOptions & { children: any };

	// Public-facing setActiveSnapPoint: when the drawer is settled (transitionState=null),
	// automatically enter "snapping" so the CSS transition is re-enabled. Without this,
	// programmatic snapping from user code (e.g. useContext().setActiveSnapPoint(0.4))
	// would jump instead of animate because the neutral state suppresses CSS transitions
	// to prevent the initial drawerSize measurement from firing spurious animations.
	const publicSetActiveSnapPoint = (sp: DrawerSize) => {
		if (transitionState() === null) setTransitionState("snapping");
		setActiveSnapPoint(sp);
	};

	const ctxValue: DrawerContextValue = {
		side: () => mergedProps.side,
		snapPoints: () => mergedProps.snapPoints,
		breakPoints: () => mergedProps.breakPoints,
		defaultSnapPoint: () => mergedProps.defaultSnapPoint,
		activeSnapPoint: () => activeSnapPoint() ?? 0,
		setActiveSnapPoint: publicSetActiveSnapPoint,
		isDragging,
		isTransitioning: () => transitionState() !== null,
		transitionState,
		openPercentage,
		translate,
		allowSkippingSnapPoints: () => mergedProps.allowSkippingSnapPoints,
		handleScrollableElements: () => mergedProps.handleScrollableElements,
		velocityCacheReset: () => mergedProps.velocityCacheReset,
	};

	const internalCtxValue: DrawerInternalContextValue = {
		...ctxValue,
		// Internal callers (state machine, DrawerContent drag) use the raw setter —
		// they manage transitionState themselves.
		setActiveSnapPoint,
		setIsDragging,
		setTranslateDrag: setTranslateDrag as Setter<number | null>,
		setTransitionState,
		drawerSize,
		setDrawerSize,
		dampFunction: mergedProps.dampFunction,
		velocityFunction: mergedProps.velocityFunction,
		resolvedSnapPoints,
		closeDrawer,
	};

	return (
		<DialogRoot
			{...dialogProps}
			open={transitionAwareOpen()}
			onOpenChange={handleDialogOpenChange}
		>
			<DrawerInternalContext value={internalCtxValue}>
				<DrawerContext value={ctxValue}>{dialogProps.children}</DrawerContext>
			</DrawerInternalContext>
		</DialogRoot>
	);
}
