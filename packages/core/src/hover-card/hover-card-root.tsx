/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard.tsx
 */

import {
	contains,
	createGlobalListeners,
	getEventPoint,
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
import { createDisclosureState } from "../primitives";
import {
	HoverCardContext,
	type HoverCardContextValue,
	type HoverCardDataSet,
} from "./hover-card-context";
import { getHoverCardSafeArea } from "./utils";

export interface HoverCardRootOptions
	extends Omit<
		PopperRootOptions,
		"anchorRef" | "contentRef" | "onCurrentPlacementChange"
	> {
	/** The controlled open state of the hovercard. */
	open?: boolean;

	/**
	 * The default open state when initially rendered.
	 * Useful when you do not need to control the open state.
	 */
	defaultOpen?: boolean;

	/** Event handler called when the open state of the hovercard changes. */
	onOpenChange?: (isOpen: boolean) => void;

	/** The duration from when the mouse enters the trigger until the hovercard opens. */
	openDelay?: number;

	/** The duration from when the mouse leaves the trigger or content until the hovercard closes. */
	closeDelay?: number;

	/** Whether to close the hovercard even if the user cursor is inside the safe area between the trigger and hovercard. */
	ignoreSafeArea?: boolean;

	/**
	 * Used to force mounting the hovercard (portal and content) when more control is needed.
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

export interface HoverCardRootProps extends ParentProps<HoverCardRootOptions> {}

/**
 * A popover that allows sighted users to preview content available behind a link.
 */
export function HoverCardRoot(props: HoverCardRootProps) {
	const defaultId = `hovercard-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			openDelay: 700,
			closeDelay: 300,
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, [
		"id",
		"open",
		"defaultOpen",
		"onOpenChange",
		"openDelay",
		"closeDelay",
		"ignoreSafeArea",
		"forceMount",
	]);

	let openTimeoutId: number | undefined;
	let closeTimeoutId: number | undefined;

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

	const { addGlobalListener, removeGlobalListener } = createGlobalListeners();

	const openWithDelay = () => {
		if (isServer) {
			return;
		}

		openTimeoutId = window.setTimeout(() => {
			openTimeoutId = undefined;
			disclosureState.open();
		}, local.openDelay);
	};

	const closeWithDelay = () => {
		if (isServer) {
			return;
		}

		closeTimeoutId = window.setTimeout(() => {
			closeTimeoutId = undefined;
			disclosureState.close();
		}, local.closeDelay);
	};

	const cancelOpening = () => {
		if (isServer) {
			return;
		}

		window.clearTimeout(openTimeoutId);
		openTimeoutId = undefined;
	};

	const cancelClosing = () => {
		if (isServer) {
			return;
		}

		window.clearTimeout(closeTimeoutId);
		closeTimeoutId = undefined;
	};

	const isTargetOnHoverCard = (target: Node | null) => {
		return contains(triggerRef(), target) || contains(contentRef(), target);
	};

	const getPolygonSafeArea = (placement: Placement) => {
		const triggerEl = triggerRef();
		const contentEl = contentRef();

		if (!triggerEl || !contentEl) {
			return;
		}

		return getHoverCardSafeArea(placement, triggerEl, contentEl);
	};

	const onHoverOutside = (event: PointerEvent) => {
		const target = event.target as Node | null;

		// Don't close if the mouse is moving through valid hovercard element.
		if (isTargetOnHoverCard(target)) {
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

		// If there's already a scheduled timeout to hide the hovercard, we do nothing.
		if (closeTimeoutId) {
			return;
		}

		// Otherwise, hide the hovercard after the close delay.
		closeWithDelay();
	};

	createEffect(() => {
		if (!disclosureState.isOpen()) {
			return;
		}

		// Checks whether the mouse is moving outside the hovercard.
		// If yes, hide the card after the close delay.
		addGlobalListener(document, "pointermove", onHoverOutside, true);

		onCleanup(() => {
			removeGlobalListener(document, "pointermove", onHoverOutside, true);
		});
	});

	// cleanup all timeout on unmount.
	onCleanup(() => {
		cancelOpening();
		cancelClosing();
	});

	const dataset: Accessor<HoverCardDataSet> = createMemo(() => ({
		"data-expanded": disclosureState.isOpen() ? "" : undefined,
		"data-closed": !disclosureState.isOpen() ? "" : undefined,
	}));

	const context: HoverCardContextValue = {
		dataset,
		isOpen: disclosureState.isOpen,
		contentPresent,
		openWithDelay,
		closeWithDelay,
		cancelOpening,
		cancelClosing,
		close: disclosureState.close,
		isTargetOnHoverCard,
		setTriggerRef,
		setContentRef,
	};

	return (
		<HoverCardContext.Provider value={context}>
			<Popper
				anchorRef={triggerRef}
				contentRef={contentRef}
				onCurrentPlacementChange={setCurrentPlacement}
				{...others}
			/>
		</HoverCardContext.Provider>
	);
}
