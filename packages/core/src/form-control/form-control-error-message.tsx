import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, Show, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useFormControlContext } from "./form-control-context";

export interface FormControlErrorMessageOptions {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The error message that gives the user information about how to fix a validation error on the form control.
 */
export function FormControlErrorMessage(
  props: OverrideComponentProps<"div", FormControlErrorMessageOptions>
) {
  const context = useFormControlContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("error-message"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "forceMount"]);

  const isInvalid = () => context.validationState() === "invalid";

  createEffect(() => {
    if (!isInvalid()) {
      return;
    }

    onCleanup(context.registerErrorMessage(local.id!));
  });

  return (
    <Show when={local.forceMount || isInvalid()}>
      <Polymorphic fallback="div" id={local.id} {...context.dataset()} {...others} />
    </Show>
  );
}
