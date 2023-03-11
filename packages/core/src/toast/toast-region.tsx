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

import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createSignal, JSX, onCleanup, onMount, splitProps } from "solid-js";

import { createLocalizedStringFormatter } from "../i18n";
import { TOAST_HOTKEY_PLACEHOLDER, TOAST_INTL_MESSAGES } from "./toast.intl";
import { ToastRegionContext, ToastRegionContextValue } from "./toast-region-context";
import { toaster } from "./toaster";
import { ToastConfig, ToastSwipeDirection } from "./types";

export interface ToastRegionOptions {
  /**
   * A label for the toast region to provide context for screen reader users when navigating page landmarks.
   * The available `{hotkey}` placeholder will be replaced for you.
   * @default "Notifications ({hotkey})"
   */
  label?: string;

  /**
   * The keys to use as the keyboard shortcut that will move focus to the toast viewport.
   * Use `event.code` value for each key from [keycode.info](https://www.toptal.com/developers/keycode).
   * For meta keys, use `ctrlKey`, `shiftKey`, `altKey` and/or `metaKey`.
   */
  hotkey?: string[];

  /** The time in milliseconds that should elapse before automatically closing each toast. */
  duration?: number;

  /**
   * The delay in milliseconds before removing a toast from the DOM when its visible duration has elapsed.
   * Useful to animate the toast out.
   */
  unmountDelay?: number;

  /** The direction of the pointer swipe that should close the toast. */
  swipeDirection?: ToastSwipeDirection;

  /** The distance in pixels that the swipe gesture must travel before a close is triggered. */
  swipeThreshold?: number;

  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface ToastRegionProps extends OverrideComponentProps<"div", ToastRegionOptions> {}

/**
 * The fixed area where toasts appear. Users can jump to the viewport by pressing a hotkey.
 * It is up to you to ensure the discoverability of the hotkey for keyboard users.
 */
export function ToastRegion(props: ToastRegionProps) {
  props = mergeDefaultProps(
    {
      hotkey: ["altKey", "KeyT"],
      duration: 5000,
      unmountDelay: 500,
      swipeDirection: "right",
      swipeThreshold: 50,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "style",
    "label",
    "hotkey",
    "duration",
    "unmountDelay",
    "swipeDirection",
    "swipeThreshold",
  ]);

  const [toasts, setToasts] = createSignal<ToastConfig[]>([]);
  const [isInteracting, setIsInteracting] = createSignal(false);

  // TODO: add i18n
  // @ts-ignore
  const stringFormatter = createLocalizedStringFormatter(() => TOAST_INTL_MESSAGES);

  const hotkeyLabel = () => {
    return local.hotkey!.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  };

  const ariaLabel = () => {
    const label = local.label || stringFormatter().format("notifications");
    return label.replace(TOAST_HOTKEY_PLACEHOLDER, hotkeyLabel());
  };

  const removeToast = (id: number) => {
    setToasts(toasts => toasts.filter(toast => toast.id !== id));
  };

  onMount(() => {
    const cleanup = toaster.subscribe(toast => {
      if (toast.dismiss) {
        setToasts(toasts => toasts.map(t => (t.id === toast.id ? { ...t, delete: true } : t)));
        return;
      }

      setToasts(toasts => [toast, ...toasts]);
    });

    onCleanup(cleanup);
  });

  const context: ToastRegionContextValue = {
    hotkey: () => local.hotkey!,
    duration: () => local.duration!,
    unmountDelay: () => local.unmountDelay!,
    swipeDirection: () => local.swipeDirection!,
    swipeThreshold: () => local.swipeThreshold!,
    toasts,
    isInteracting,
    setIsInteracting,
    removeToast,
  };

  return (
    <ToastRegionContext.Provider value={context}>
      <div
        role="region"
        tabIndex={-1}
        aria-label={ariaLabel()}
        // in case list has size when empty (e.g. padding), we remove pointer events,
        // so it doesn't prevent interactions with page elements that it overlays
        style={{
          "pointer-events": toasts().length > 0 ? undefined : "none",
          ...local.style,
        }}
        {...others}
      />
    </ToastRegionContext.Provider>
  );
}
