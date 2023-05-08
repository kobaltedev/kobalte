/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/avatar/src/Avatar.tsx
 */

import { OverrideComponentProps } from "@kobalte/utils";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useImageContext } from "./image-context";

export interface ImageFallbackProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * An element that renders when the image hasn't loaded.
 * This means whilst it's loading, or if there was an error.
 */
export function ImageFallback(props: ImageFallbackProps) {
  const context = useImageContext();

  const [canRender, setCanRender] = createSignal(context.fallbackDelay() === undefined);

  createEffect(() => {
    const delayMs = context.fallbackDelay();

    if (delayMs !== undefined) {
      const timerId = window.setTimeout(() => setCanRender(true), delayMs);
      onCleanup(() => window.clearTimeout(timerId));
    }
  });

  return (
    <Show when={canRender() && context.imageLoadingStatus() !== "loaded"}>
      <Polymorphic as="span" {...props} />
    </Show>
  );
}
