import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps, createEffect, onCleanup, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useFormControlContext } from "./form-control-context";

/**
 * The description that gives the user more information on the form control.
 */
export function FormControlDescription(props: ComponentProps<"div">) {
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
