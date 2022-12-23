import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createDismissableLayer, createFocusScope } from "../primitives";
import { useDialogContext } from "./dialog-context";

/**
 * Contains the content to be rendered when the dialog is open.
 */
export const DialogContent = createPolymorphicComponent<"div">(props => {
  let ref: HTMLDivElement | undefined;

  const context = useDialogContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("content"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref", "id", "onFocusOut"]);

  const dismissableLayer = createDismissableLayer(context.createDismissableLayerProps, () => ref);

  const { FocusTrap } = createFocusScope(context.createFocusScopeProps, () => ref);

  const onFocusOut: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onFocusOut);
    callHandler(e, dismissableLayer.onFocusOut);
  };

  createEffect(() => onCleanup(context.registerContentId(local.id!)));

  return (
    <Show when={context.shouldMount()}>
      <FocusTrap />
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => (ref = el), local.ref)}
        role="dialog"
        id={local.id}
        tabIndex={-1}
        aria-labelledby={context.titleId()}
        aria-describedby={context.descriptionId()}
        onFocusOut={onFocusOut}
        {...others}
      />
      <FocusTrap />
    </Show>
  );
});
