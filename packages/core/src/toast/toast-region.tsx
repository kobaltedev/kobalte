/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 *
 * Portions of this file are based on code from sonner.
 * MIT Licensed, Copyright (c) 2023 Emil Kowalski.
 *
 * Credits to the sonner team:
 * https://github.com/emilkowalski/sonner/blob/0d027fd3a41013fada9d8a3ef807bcc87053bde8/src/index.tsx
 */

import {
	OverrideComponentProps,
	createGenerateId,
	mergeDefaultProps,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import { DATA_TOP_LAYER_ATTR } from "../dismissable-layer/layer-stack";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	ToastRegionContext,
	type ToastRegionContextValue,
} from "./toast-region-context";
import { toastStore } from "./toast-store";
import {
	TOAST_HOTKEY_PLACEHOLDER,
	TOAST_REGION_INTL_TRANSLATIONS,
	type ToastRegionIntlTranslations,
} from "./toast.intl";
import type { ToastSwipeDirection } from "./types";

export interface ToastRegionOptions {
	/** The localized strings of the component. */
	translations?: ToastRegionIntlTranslations;

	/**
	 * A label for the toast region to provide context for screen reader users when navigating page landmarks.
	 * Can contain a `{hotkey}` placeholder which will be replaced for you.
	 * @default "Notifications ({hotkey})"
	 */
	"aria-label"?: string;

	/**
	 * The keys to use as the keyboard shortcut that will move focus to the toast region.
	 * Use `event.code` value for each key from [keycode.info](https://www.toptal.com/developers/keycode).
	 * For meta keys, use `ctrlKey`, `shiftKey`, `altKey` and/or `metaKey`.
	 * @default alt + T
	 */
	hotkey?: string[];

	/** The time in milliseconds that should elapse before automatically closing each toast. */
	duration?: number;

	/** The maximum amount of toasts that can be displayed at the same time. */
	limit?: number;

	/** The direction of the pointer swipe that should close the toast. */
	swipeDirection?: ToastSwipeDirection;

	/** The distance in pixels that the swipe gesture must travel before a close is triggered. */
	swipeThreshold?: number;

	/** Whether the toasts close timeout should pause when a toast is hovered or focused. */
	pauseOnInteraction?: boolean;

	/**
	 * Whether the toasts close timeout should pause when the document loses focus or the page is idle
	 * (e.g. switching to a new browser tab).
	 */
	pauseOnPageIdle?: boolean;

	/**
	 * Whether the toast region is marked as a "top layer", so that it:
	 *  - is not aria-hidden when opening an overlay.
	 *  - allows focus even outside a containing focus scope.
	 *  - doesn’t dismiss overlays when clicking on it, even though it is outside.
	 */
	topLayer?: boolean;

	/** The id of the toast region, used for multiple toast regions. */
	regionId?: string;
}

export interface ToastRegionCommonProps<T extends HTMLElement = HTMLElement> {
	style?: JSX.CSSProperties | string;
	id: string;
}

export interface ToastRegionRenderProps extends ToastRegionCommonProps {
	role: "region";
	tabIndex: -1;
	"aria-label": string;
	"data-kb-top-layer": string | undefined;
}

export type ToastRegionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToastRegionOptions & Partial<ToastRegionCommonProps<ElementOf<T>>>;

/**
 * The fixed area where toasts appear. Users can jump to by pressing a hotkey.
 * It is up to you to ensure the discoverability of the hotkey for keyboard users.
 */
export function ToastRegion<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ToastRegionProps<T>>,
) {
	const mergedProps = mergeDefaultProps(
		{
			id: `toast-region-${createUniqueId()}`,
			hotkey: ["altKey", "KeyT"],
			duration: 5000,
			limit: 3,
			swipeDirection: "right",
			swipeThreshold: 50,
			pauseOnInteraction: true,
			pauseOnPageIdle: true,
			topLayer: true,
			translations: TOAST_REGION_INTL_TRANSLATIONS,
		},
		props as ToastRegionProps,
	);

	const [local, others] = splitProps(
		mergedProps as typeof mergedProps & { id: string },
		[
			"translations",
			"style",
			"hotkey",
			"duration",
			"limit",
			"swipeDirection",
			"swipeThreshold",
			"pauseOnInteraction",
			"pauseOnPageIdle",
			"topLayer",
			"aria-label",
			"regionId",
		],
	);

	const toasts = createMemo(() =>
		toastStore
			.toasts()
			.filter(
				(toast) => toast.region === local.regionId && toast.dismiss === false,
			)
			.slice(0, local.limit!),
	);

	const [isPaused, setIsPaused] = createSignal(false);

	const hasToasts = () => toasts().length > 0;

	const hotkeyLabel = () => {
		return local.hotkey!.join("+").replace(/Key/g, "").replace(/Digit/g, "");
	};

	const ariaLabel = () => {
		const label =
			local["aria-label"] ||
			local.translations!.notifications(TOAST_HOTKEY_PLACEHOLDER);

		return label.replace(TOAST_HOTKEY_PLACEHOLDER, hotkeyLabel());
	};

	const topLayerAttr = () => ({
		[DATA_TOP_LAYER_ATTR]: local.topLayer ? "" : undefined,
	});

	const context: ToastRegionContextValue = {
		isPaused,
		toasts,
		hotkey: () => local.hotkey!,
		duration: () => local.duration!,
		swipeDirection: () => local.swipeDirection!,
		swipeThreshold: () => local.swipeThreshold!,
		pauseOnInteraction: () => local.pauseOnInteraction!,
		pauseOnPageIdle: () => local.pauseOnPageIdle!,
		pauseAllTimer: () => setIsPaused(true),
		resumeAllTimer: () => setIsPaused(false),
		generateId: createGenerateId(() => others.id!),
	};

	return (
		<ToastRegionContext.Provider value={context}>
			<Polymorphic<ToastRegionRenderProps>
				as="div"
				role="region"
				tabIndex={-1}
				aria-label={ariaLabel()}
				// In case it has size when empty (e.g. padding), we remove pointer events,
				// so it doesn't prevent interactions with page elements that it overlays.
				// In case it is a top layer, we explicitly enable pointer-events prevented by a `DismissableLayer`.
				style={combineStyle(
					{
						"pointer-events": hasToasts()
							? local.topLayer
								? "auto"
								: undefined
							: "none",
					},
					local.style,
				)}
				{...topLayerAttr()}
				{...others}
			/>
		</ToastRegionContext.Provider>
	);
}
