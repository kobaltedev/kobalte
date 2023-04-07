import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useFormControlContext } from "./form-control-context";

export interface FormControlDescriptionProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The description that gives the user more information on the form control.
 */
export function FormControlDescription(props: FormControlDescriptionProps) {
  const context = useFormControlContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerDescription(local.id!)));

  return <Polymorphic as="div" id={local.id} {...context.dataset()} {...others} />;
}
