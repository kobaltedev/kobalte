import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useFormControlContext } from "./form-control-context";

export interface FormControlErrorMessageProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The error message that gives the user information about how to fix a validation error on the form control.
 */
export const FormControlErrorMessage = createPolymorphicComponent<
  "div",
  FormControlErrorMessageProps
>(props => {
  const context = useFormControlContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("error-message"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id", "forceMount"]);

  const isInvalid = () => context.validationState() === "invalid";

  createEffect(() => {
    if (!isInvalid()) {
      return;
    }

    onCleanup(context.registerErrorMessage(local.id!));
  });

  return (
    <Show when={local.forceMount || isInvalid()}>
      <Dynamic component={local.as} id={local.id} {...context.dataset()} {...others} />
    </Show>
  );
});
