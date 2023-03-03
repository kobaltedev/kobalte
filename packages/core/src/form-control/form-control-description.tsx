import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useFormControlContext } from "./form-control-context";

/**
 * The description that gives the user more information on the form control.
 */
export function FormControlDescription(props: OverrideComponentProps<"div", AsChildProp>) {
  const context = useFormControlContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerDescription(local.id!)));

  return <Polymorphic fallback="div" id={local.id} {...context.dataset()} {...others} />;
}
