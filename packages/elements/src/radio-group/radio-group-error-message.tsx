import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, on, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupContext } from "./radio-group-context";

export interface RadioGroupErrorMessageProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * An error message that gives the user information about what's going wrong with the radio group.
 */
export const RadioGroupErrorMessage = createPolymorphicComponent<
  "div",
  RadioGroupErrorMessageProps
>(props => {
  const context = useRadioGroupContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.getPartId("error-message"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id", "forceMount"]);

  const isInvalid = () => context.validationState() === "invalid";

  createEffect(() => {
    context.setAriaErrorMessage(isInvalid() ? local.id : undefined);

    onCleanup(() => {
      context.setAriaErrorMessage(undefined);
    });
  });

  return (
    <Show when={local.forceMount || isInvalid()}>
      <Dynamic
        component={local.as}
        id={local.id}
        data-part="error-message"
        {...context.dataset()}
        {...others}
      />
    </Show>
  );
});
