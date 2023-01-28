/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/link/src/useLink.ts
 */

import {
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { splitProps } from "solid-js";

import { Pressable, PressableOptions } from "../pressable";
import {
  createFocusRing,
  createHover,
  createTagName,
  FOCUS_RING_HANDLERS_PROP_NAMES,
  HOVER_HANDLERS_PROP_NAMES,
} from "../primitives";

export interface LinkRootOptions extends PressableOptions {}

/**
 * Link allows a user to navigate to another page or resource within a web page or application.
 */
export const LinkRoot = /*#__PURE__*/ createPolymorphicComponent<"a", LinkRootOptions>(props => {
  let ref: HTMLAnchorElement | undefined;

  props = mergeDefaultProps({ as: "a" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    ...HOVER_HANDLERS_PROP_NAMES,
    ...FOCUS_RING_HANDLERS_PROP_NAMES,
  ]);

  const { isHovered, hoverHandlers } = createHover({
    isDisabled: () => others.isDisabled,
  });

  const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing();

  const tagName = createTagName(
    () => ref,
    () => local.as || "a"
  );

  return (
    <Pressable
      as={local.as!}
      ref={mergeRefs(el => (ref = el), local.ref)}
      role={tagName() !== "a" ? "link" : undefined}
      tabIndex={tagName() !== "a" && !others.isDisabled ? 0 : undefined}
      data-hover={isHovered() ? "" : undefined}
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      onPointerEnter={composeEventHandlers([local.onPointerEnter, hoverHandlers.onPointerEnter])}
      onPointerLeave={composeEventHandlers([local.onPointerLeave, hoverHandlers.onPointerLeave])}
      onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
      onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
      {...others}
    />
  );
});
