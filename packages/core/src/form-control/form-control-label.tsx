import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createTagName } from "../primitives";
import { useFormControlContext } from "./form-control-context";

/**
 * The label that gives the user information on the form control.
 */
export const FormControlLabel = /*#__PURE__*/ createPolymorphicComponent<"label">(props => {
  let ref: HTMLElement | undefined;

  const context = useFormControlContext();

  props = mergeDefaultProps(
    {
      as: "label",
      id: context.generateId("label"),
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
      for={tagName() === "label" ? context.fieldId() : undefined}
      {...context.dataset()}
      {...others}
    />
  );
});
