/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlay.ts
 */

import { callHandler, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export const Underlay = createPolymorphicComponent<"div">(props => {
  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "onPointerDown"]);

  const onPointerDown: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    // fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  return <Dynamic component={local.as} onPointerDown={onPointerDown} {...others} />;
});
