import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { ComponentProps, createEffect, onCleanup, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { createTagName } from "../primitives";
import { useFormControlContext } from "./form-control-context";

/**
 * The label that gives the user information on the form control.
 */
export function FormControlLabel(props: ComponentProps<"label">) {
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
      fallback="label"
      ref={mergeRefs(el => (ref = el), local.ref)}
      id={local.id}
      for={tagName() === "label" ? context.fieldId() : undefined}
      {...context.dataset()}
      {...others}
    />
  );
}
