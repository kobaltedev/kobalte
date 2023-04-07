import { mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { createTagName } from "../primitives";
import { useFormControlContext } from "./form-control-context";

export interface FormControlLabelProps extends OverrideComponentProps<"label", AsChildProp> {}

/**
 * The label that gives the user information on the form control.
 */
export function FormControlLabel(props: FormControlLabelProps) {
  let ref: HTMLElement | undefined;

  const context = useFormControlContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id"]);

  const tagName = createTagName(
    () => ref,
    () => "label"
  );

  createEffect(() => onCleanup(context.registerLabel(local.id!)));

  return (
    <Polymorphic
      as="label"
      ref={mergeRefs(el => (ref = el), local.ref)}
      id={local.id}
      for={tagName() === "label" ? context.fieldId() : undefined}
      {...context.dataset()}
      {...others}
    />
  );
}
