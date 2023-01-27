import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useProgressContext } from "./progress-context";

/**
 * An accessible label that gives the user information on the progress.
 */
export const ProgressLabel = createPolymorphicComponent<"span">(props => {
  const context = useProgressContext();

  props = mergeDefaultProps(
    {
      as: "span",
      id: context.generateId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerLabelId(local.id!)));

  return <Dynamic component={local.as} id={local.id} {...context.dataset()} {...others} />;
});
