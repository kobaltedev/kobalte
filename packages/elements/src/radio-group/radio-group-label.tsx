import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, on, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupContext } from "./radio-group-context";

/**
 * A label that gives the user information on the radio group.
 */
export const RadioGroupLabel = createPolymorphicComponent<"span">(props => {
  const context = useRadioGroupContext();

  props = mergeDefaultProps(
    {
      as: "span",
      id: context.getPartId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(
    on(
      () => local.id,
      id => {
        context.setAriaLabelledBy(id);

        onCleanup(() => {
          context.setAriaLabelledBy(undefined);
        });
      }
    )
  );

  return (
    <Dynamic
      component={local.as}
      id={local.id}
      data-part="label"
      {...context.dataset()}
      {...others}
    />
  );
});
