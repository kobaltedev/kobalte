/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useModalOverlay.ts
 */

import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { Overlay, OverlayProps } from "../overlay";
import { createPreventScroll } from "../primitives";
import { ariaHideOutside } from "./aria-hide-outside";

export interface ModalOverlayProps extends OverlayProps {}

/**
 * An overlay element which blocks interaction with elements outside it.
 */
export const Modal = createPolymorphicComponent<"div", ModalOverlayProps>(props => {
  let ref: HTMLDivElement | undefined;

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["ref"]);

  createPreventScroll({
    isDisabled: () => !others.isOpen,
  });

  createEffect(() => {
    if (!ref || !others.isOpen) {
      return;
    }

    const cleanup = ariaHideOutside([ref]);

    onCleanup(cleanup);
  });

  return <Overlay ref={mergeRefs(el => (ref = el), local.ref)} {...others} />;
});
