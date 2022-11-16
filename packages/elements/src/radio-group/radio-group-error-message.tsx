import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, on, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useRadioGroupContext } from "./radio-group-context";

/**
 * An error message that gives the user information about what's going wrong with the radio group.
 */
export const RadioGroupErrorMessage = createPolymorphicComponent<"div">(props => {
  const context = useRadioGroupContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.getPartId("error-message"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(
    on(
      () => local.id,
      id => {
        context.setAriaErrorMessage(id);

        onCleanup(() => {
          context.setAriaErrorMessage(undefined);
        });
      }
    )
  );

  return <Dynamic component={local.as} id={local.id} data-part="error-message" {...others} />;
});
