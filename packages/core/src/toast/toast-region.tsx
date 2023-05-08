/*!
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

import { createGenerateId, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, JSX, splitProps } from "solid-js";

import { DATA_TOP_LAYER_ATTR } from "../dismissable-layer/layer-stack";
import { createMessageFormatter } from "../i18n";
import { TOAST_HOTKEY_PLACEHOLDER, TOAST_INTL_MESSAGES } from "./toast.intl";
import { ToastRegionContext, ToastRegionContextValue } from "./toast-region-context";
import { toastStore } from "./toast-store";
import { ToastSwipeDirection } from "./types";

export interface ToastRegionOptions {
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

  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface ToastRegionProps extends OverrideComponentProps<"div", ToastRegionOptions> {}

/**
 * The fixed area where toasts appear. Users can jump to by pressing a hotkey.
 * It is up to you to ensure the discoverability of the hotkey for keyboard users.
 */
export function ToastRegion(props: ToastRegionProps) {
  const defaultId = `toast-region-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      hotkey: ["altKey", "KeyT"],
      duration: 5000,
      limit: 3,
      swipeDirection: "right",
      swipeThreshold: 50,
      pauseOnInteraction: true,
      pauseOnPageIdle: true,
      topLayer: true,
    },
    props
  );

  const [local, others] = splitProps(props, [
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
  ]);

  const toasts = createMemo(() =>
    toastStore
      .toasts()
      .filter(toast => toast.region === local.regionId)
      .slice(0, local.limit!)
  );

  const [isPaused, setIsPaused] = createSignal(false);

  const messageFormatter = createMessageFormatter(() => TOAST_INTL_MESSAGES);

  const hasToasts = () => toasts().length > 0;

  const hotkeyLabel = () => {
    return local.hotkey!.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  };

  const ariaLabel = () => {
    const label =
      local["aria-label"] ||
      messageFormatter().format("notifications", {
        hotkey: hotkeyLabel(),
      });

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
      <div
        role="region"
        tabIndex={-1}
        aria-label={ariaLabel()}
        // In case it has size when empty (e.g. padding), we remove pointer events,
        // so it doesn't prevent interactions with page elements that it overlays.
        // In case it is a top layer, we explicitly enable pointer-events prevented by a `DismissableLayer`.
        style={{
          "pointer-events": hasToasts() ? (local.topLayer ? "auto" : undefined) : "none",
          ...local.style,
        }}
        {...topLayerAttr}
        {...others}
      />
    </ToastRegionContext.Provider>
  );
}
