import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, on, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupContext } from "./radio-group-context";

/**
 * A description that gives the user more information on the radio group.
 */
export const RadioGroupDescription = createPolymorphicComponent<"div">(props => {
  const context = useRadioGroupContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.getPartId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(
    on(
      () => local.id,
      id => {
        context.setAriaDescribedBy(id);

        onCleanup(() => {
          context.setAriaDescribedBy(undefined);
        });
      }
    )
  );

  return (
    <Dynamic
      component={local.as}
      id={local.id}
      data-part="description"
      data-disabled={context.disabled() ? "" : undefined}
      {...others}
    />
  );
});
