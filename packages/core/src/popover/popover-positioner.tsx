import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { usePopoverContext } from "./popover-context";
import { createFocusTrapRegion, createOverlay } from "../primitives";

export interface PopoverPositionerProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * A wrapper component to help positioning the popover content on screen.
 */
export const PopoverPositioner = createPolymorphicComponent<"div", PopoverPositionerProps>(
  props => {
    let ref: HTMLDivElement | undefined;

    const context = usePopoverContext();

    props = mergeDefaultProps({ as: "div" }, props);

    const [local, others] = splitProps(props, ["as", "ref", "style", "onFocusOut"]);

    const { DismissableLayerProvider, dismissableLayerProps, dismissableLayerHandlers } =
      createOverlay(context.createOverlayProps, () => ref);

    //const { FocusTrap } = createFocusTrapRegion(context.createFocusTrapRegionProps, () => ref);

    const onFocusOut: JSX.EventHandlerUnion<any, FocusEvent> = e => {
      callHandler(e, local.onFocusOut);
      callHandler(e, dismissableLayerHandlers.onFocusOut);
    };

    return (
      <Show when={context.shouldMount()}>
        <DismissableLayerProvider>
          <Dynamic
            component={local.as}
            ref={mergeRefs(el => {
              context.setPositionerRef(el);
              ref = el;
            }, local.ref)}
            role="presentation"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              "pointer-events": dismissableLayerProps.cssPointerEventsValue(),
              ...local.style,
            }}
            onFocusOut={onFocusOut}
            {...others}
          />
        </DismissableLayerProvider>
      </Show>
    );
  }
);
