/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/tooltip/tooltip.tsx
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e67d48d4935b772f915b08f1d695d2ebafb876f0/packages/@react-stately/tooltip/src/useTooltipTriggerState.ts
 */

import {
	contains,
	createGenerateId,
	getDocument,
	getEventPoint,
	getWindow,
	isPointInPolygon,
	mergeDefaultProps,
} from "@kobalte/utils";
import {
	type Accessor,
	type ParentProps,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	splitProps,
} from "solid-js";
import { isServer } from "solid-js/web";

import createPresence from "solid-presence";
import { Popper, type PopperRootOptions } from "../popper";
import type { Placement } from "../popper/utils";
import { createDisclosureState, createRegisterId } from "../primitives";
import {
	TooltipContext,
	type TooltipContextValue,
	type TooltipDataSet,
} from "./tooltip-context";
import { getTooltipSafeArea } from "./utils";

const tooltips: any = {};
let tooltipsCounter = 0;
let globalWarmedUp = false;
let globalWarmUpTimeout: number | undefined;
let globalCoolDownTimeout: number | undefined;
let globalSkipDelayTimeout: number | undefined;

export interface TooltipRootOptions
	extends Omit<
		PopperRootOptions,
		"anchorRef" | "contentRef" | "onCurrentPlacementChange"
	> {
	/** The controlled open state of the tooltip. */
	open?: boolean;

	/**
	 * The default open state when initially rendered.
	 * Useful when you do not need to control the open state.
	 */
	defaultOpen?: boolean;

	/** Event handler called when the open state of the tooltip changes. */
	onOpenChange?: (isOpen: boolean) => void;

	/** Whether the tooltip should be disabled, independent of the trigger. */
	disabled?: boolean;

	/**
	 * Whether to open the tooltip only when the trigger is focused.
	 * By default, opens for both focus and hover.
	 */
	triggerOnFocusOnly?: boolean;

	/** The duration from when the mouse enters the trigger until the tooltip opens. */
	openDelay?: number;

	/** The duration from when the mouse leaves the trigger or content until the tooltip closes. */
	closeDelay?: number;

	/** The duration from when the mouse leaves the trigger or content and moves to another tooltip trigger or content */
	skipDelayDuration?: number;

	/** Whether to close the tooltip even if the user cursor is inside the safe area between the trigger and tooltip. */
	ignoreSafeArea?: boolean;

	/**
	 * Used to force mounting the tooltip (portal and content) when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;
}

export interface TooltipRootProps extends ParentProps<TooltipRootOptions> {}

/**
 * A popup that displays information related to an element
 * when the element receives keyboard focus or the mouse hovers over it.
 */
export function TooltipRoot(props: TooltipRootProps) {
	const defaultId = `tooltip-${createUniqueId()}`;

	// This is not the DOM id.
	const tooltipId = `${++tooltipsCounter}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			openDelay: 700,
			closeDelay: 300,
			skipDelayDuration: 300,
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, [
		"id",
		"open",
		"defaultOpen",
		"onOpenChange",
		"disabled",
		"triggerOnFocusOnly",
		"openDelay",
		"closeDelay",
		"skipDelayDuration",
		"ignoreSafeArea",
		"forceMount",
	]);

	let closeTimeoutId: number | undefined;

	const [contentId, setContentId] = createSignal<string>();
	const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
	const [contentRef, setContentRef] = createSignal<HTMLElement>();

	const [currentPlacement, setCurrentPlacement] = createSignal<Placement>(
		others.placement!,
	);

	const disclosureState = createDisclosureState({
		open: () => local.open,
		defaultOpen: () => local.defaultOpen,
		onOpenChange: (isOpen) => local.onOpenChange?.(isOpen),
	});

	const { present: contentPresent } = createPresence({
		show: () => local.forceMount || disclosureState.isOpen(),
		element: () => contentRef() ?? null,
	});

	const ensureTooltipEntry = () => {
		tooltips[tooltipId] = hideTooltip;
	};

	const closeOpenTooltips = () => {
		for (const hideTooltipId in tooltips) {
			if (hideTooltipId !== tooltipId) {
				tooltips[hideTooltipId](true);
				delete tooltips[hideTooltipId];
			}
		}
	};

	const hideTooltip = (immediate = false) => {
		if (isServer) {
			return;
		}

		if (immediate || (local.closeDelay && local.closeDelay <= 0)) {
			window.clearTimeout(closeTimeoutId);
			closeTimeoutId = undefined;
			disclosureState.close();
		} else if (!closeTimeoutId) {
			closeTimeoutId = window.setTimeout(() => {
				closeTimeoutId = undefined;
				disclosureState.close();
			}, local.closeDelay);
		}

		window.clearTimeout(globalWarmUpTimeout);
		globalWarmUpTimeout = undefined;

		if (local.skipDelayDuration && local.skipDelayDuration >= 0) {
			globalSkipDelayTimeout = window.setTimeout(() => {
				window.clearTimeout(globalSkipDelayTimeout);
				globalSkipDelayTimeout = undefined;
			}, local.skipDelayDuration);
		}

		if (globalWarmedUp) {
			window.clearTimeout(globalCoolDownTimeout);

			globalCoolDownTimeout = window.setTimeout(() => {
				delete tooltips[tooltipId];
				globalCoolDownTimeout = undefined;
				globalWarmedUp = false;
			}, local.closeDelay);
		}
	};

	const showTooltip = () => {
		if (isServer) {
			return;
		}

		clearTimeout(closeTimeoutId);
		closeTimeoutId = undefined;
		closeOpenTooltips();
		ensureTooltipEntry();
		globalWarmedUp = true;
		disclosureState.open();

		window.clearTimeout(globalWarmUpTimeout);
		globalWarmUpTimeout = undefined;

		window.clearTimeout(globalCoolDownTimeout);
		globalCoolDownTimeout = undefined;

		window.clearTimeout(globalSkipDelayTimeout);
		globalSkipDelayTimeout = undefined;
	};

	const warmupTooltip = () => {
		if (isServer) {
			return;
		}

		closeOpenTooltips();
		ensureTooltipEntry();

		if (!disclosureState.isOpen() && !globalWarmUpTimeout && !globalWarmedUp) {
			globalWarmUpTimeout = window.setTimeout(() => {
				globalWarmUpTimeout = undefined;
				globalWarmedUp = true;
				showTooltip();
			}, local.openDelay);
		} else if (!disclosureState.isOpen()) {
			showTooltip();
		}
	};

	const openTooltip = (immediate = false) => {
		if (isServer) {
			return;
		}

		if (
			!immediate &&
			local.openDelay &&
			local.openDelay > 0 &&
			!closeTimeoutId &&
			!globalSkipDelayTimeout
		) {
			warmupTooltip();
		} else {
			showTooltip();
		}
	};

	const cancelOpening = () => {
		if (isServer) {
			return;
		}

		window.clearTimeout(globalWarmUpTimeout);
		globalWarmUpTimeout = undefined;
		globalWarmedUp = false;
	};

	const cancelClosing = () => {
		if (isServer) {
			return;
		}

		window.clearTimeout(closeTimeoutId);
		closeTimeoutId = undefined;
	};

	const isTargetOnTooltip = (target: Node | null) => {
		return contains(triggerRef(), target) || contains(contentRef(), target);
	};

	const getPolygonSafeArea = (placement: Placement) => {
		const triggerEl = triggerRef();
		const contentEl = contentRef();

		if (!triggerEl || !contentEl) {
			return;
		}

		return getTooltipSafeArea(placement, triggerEl, contentEl);
	};

	const onHoverOutside = (event: PointerEvent) => {
		const target = event.target as Node | null;

		// Don't close if the mouse is moving through valid tooltip element.
		if (isTargetOnTooltip(target)) {
			cancelClosing();
			return;
		}

		if (!local.ignoreSafeArea) {
			const polygon = getPolygonSafeArea(currentPlacement());

			//Don't close if the current's event mouse position is inside the polygon safe area.
			if (polygon && isPointInPolygon(getEventPoint(event), polygon)) {
				cancelClosing();
				return;
			}
		}

		// If there's already a scheduled timeout to hide the tooltip, we do nothing.
		if (closeTimeoutId) {
			return;
		}

		// Otherwise, hide the tooltip after the close delay.
		hideTooltip();
	};

	createEffect(() => {
		if (isServer) {
			return;
		}

		if (!disclosureState.isOpen()) {
			return;
		}

		const doc = getDocument();

		// Checks whether the mouse is moving outside the tooltip.
		// If yes, hide the tooltip after the close delay.
		doc.addEventListener("pointermove", onHoverOutside, true);

		onCleanup(() => {
			doc.removeEventListener("pointermove", onHoverOutside, true);
		});
	});

	// Close the tooltip if the trigger is scrolled.
	createEffect(() => {
		const trigger = triggerRef();

		if (!trigger || !disclosureState.isOpen()) {
			return;
		}

		const handleScroll = (event: Event) => {
			const target = event.target as HTMLElement;

			if (contains(target, trigger)) {
				hideTooltip(true);
			}
		};

		const win = getWindow();

		win.addEventListener("scroll", handleScroll, { capture: true });

		onCleanup(() => {
			win.removeEventListener("scroll", handleScroll, { capture: true });
		});
	});

	onCleanup(() => {
		clearTimeout(closeTimeoutId);

		const tooltip = tooltips[tooltipId];

		if (tooltip) {
			delete tooltips[tooltipId];
		}
	});

	const dataset: Accessor<TooltipDataSet> = createMemo(() => ({
		"data-expanded": disclosureState.isOpen() ? "" : undefined,
		"data-closed": !disclosureState.isOpen() ? "" : undefined,
	}));

	const context: TooltipContextValue = {
		dataset,
		isOpen: disclosureState.isOpen,
		isDisabled: () => local.disabled ?? false,
		triggerOnFocusOnly: () => local.triggerOnFocusOnly ?? false,
		contentId,
		contentPresent,
		openTooltip,
		hideTooltip,
		cancelOpening,
		generateId: createGenerateId(() => mergedProps.id!),
		registerContentId: createRegisterId(setContentId),
		isTargetOnTooltip,
		setTriggerRef,
		setContentRef,
	};

	return (
		<TooltipContext.Provider value={context}>
			<Popper
				anchorRef={triggerRef}
				contentRef={contentRef}
				onCurrentPlacementChange={setCurrentPlacement}
				{...others}
			/>
		</TooltipContext.Provider>
	);
}
