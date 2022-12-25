import {
  createPolymorphicComponent,
  focusWithoutScrolling,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { Overlay } from "../overlay";
import { useDialogContext } from "./dialog-context";
import { createFocusScope } from "../primitives";

export interface DialogContentProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * Contains the content to be rendered when the dialog is open.
 */
export const DialogContent = createPolymorphicComponent<"div", DialogContentProps>(props => {
  let ref: HTMLElement | undefined;

  const context = useDialogContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("content"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id"]);

  createFocusScope(
    {
      trapFocus: () => context.isOpen() && context.isModal(),
    },
    () => ref
  );

  createEffect(() => onCleanup(context.registerContentId(local.id!)));

  return (
    <Show when={context.shouldMount()}>
      <Overlay
        ref={mergeRefs(el => (ref = el), local.ref)}
        role="dialog"
        id={local.id}
        tabIndex={-1}
        isOpen={context.isOpen()}
        isModal={context.isModal()}
        closeOnEsc={context.closeOnEsc()}
        closeOnInteractOutside={context.closeOnInteractOutside()}
        shouldCloseOnInteractOutside={context.shouldCloseOnInteractOutside}
        onClose={context.close}
        aria-labelledby={context.titleId()}
        aria-describedby={context.descriptionId()}
        {...others}
      />
    </Show>
  );
});
