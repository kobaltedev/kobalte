import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createTagName } from "../primitives";
import { useFieldContext } from "./field-context";

/**
 * A label that gives the user information on the field.
 */
export const FieldLabel = createPolymorphicComponent<"label">(props => {
  let ref: HTMLLabelElement | undefined;

  const context = useFieldContext();

  props = mergeDefaultProps(
    {
      as: "label",
      id: context.generateFieldPartId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref", "id"]);

  const tagName = createTagName(
    () => ref,
    () => local.as || "label"
  );

  createEffect(() => onCleanup(context.registerLabel(local.id!)));

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      id={local.id}
      for={tagName() === "label" ? context.inputId() : undefined}
      {...context.dataset()}
      {...others}
    />
  );
});
