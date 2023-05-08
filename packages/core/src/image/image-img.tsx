/* eslint-disable jsx-a11y/alt-text */

/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/avatar/src/Avatar.tsx
 */

import { ComponentProps, createEffect, createSignal, on, onCleanup, Show } from "solid-js";

import { useImageContext } from "./image-context";
import { ImageLoadingStatus } from "./types";

export interface ImageImgProps extends ComponentProps<"img"> {}

/**
 * The image to render. By default, it will only render when it has loaded.
 */
export function ImageImg(props: ImageImgProps) {
  const context = useImageContext();

  const [loadingStatus, setLoadingStatus] = createSignal<ImageLoadingStatus>("idle");

  createEffect(
    on(
      () => props.src,
      src => {
        if (!src) {
          setLoadingStatus("error");
          return;
        }

        let isMounted = true;
        const image = new window.Image();

        const updateStatus = (status: ImageLoadingStatus) => () => {
          if (!isMounted) {
            return;
          }

          setLoadingStatus(status);
        };

        setLoadingStatus("loading");
        image.onload = updateStatus("loaded");
        image.onerror = updateStatus("error");
        image.src = src;

        onCleanup(() => {
          isMounted = false;
        });
      }
    )
  );

  createEffect(() => {
    const imageLoadingStatus = loadingStatus();

    if (imageLoadingStatus !== "idle") {
      context.onImageLoadingStatusChange(imageLoadingStatus);
    }
  });

  return (
    <Show when={loadingStatus() === "loaded"}>
      <img {...props} />
    </Show>
  );
}
