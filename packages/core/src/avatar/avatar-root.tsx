/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/avatar/src/Avatar.tsx
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { ImageLoadingStatus } from "./types";
import { AvatarContext, AvatarContextValue } from "./avatar-context";

export interface AvatarRootOptions {
  /**
   * The delay (in ms) before displaying the avatar fallback.
   * Useful if you notice a flash during loading for delaying rendering,
   * so it only appears for those with slower internet connections.
   */
  fallbackDelay?: number;

  /**
   * A callback providing information about the loading status of the image.
   * This is useful in case you want to control more precisely what to render as the image is loading.
   */
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

/**
 * An image element with a fallback for representing the user.
 */
export const AvatarRoot = createPolymorphicComponent<"span", AvatarRootOptions>(props => {
  props = mergeDefaultProps({ as: "span" }, props);

  const [local, others] = splitProps(props, ["as", "fallbackDelay", "onLoadingStatusChange"]);

  const [imageLoadingStatus, setImageLoadingStatus] = createSignal<ImageLoadingStatus>("idle");

  const context: AvatarContextValue = {
    fallbackDelay: () => local.fallbackDelay,
    imageLoadingStatus,
    onImageLoadingStatusChange: status => {
      setImageLoadingStatus(status);
      local.onLoadingStatusChange?.(status);
    },
  };

  return (
    <AvatarContext.Provider value={context}>
      <Dynamic component={local.as} {...others} />
    </AvatarContext.Provider>
  );
});
