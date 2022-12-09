import { access, MaybeAccessor, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, createMemo, onCleanup } from "solid-js";

import { useFormControlContext } from "./form-control-context";

export interface CreateFormControlFieldProps {
  /**
   * The HTML id attribute of the field.
   * If no id prop is provided, a generated id will be used.
   */
  id?: MaybeAccessor<string | undefined>;

  /** The HTML aria-label attribute of the field. */
  "aria-label"?: MaybeAccessor<string | undefined>;

  /** The HTML aria-labelledby attribute of the field. */
  "aria-labelledby"?: MaybeAccessor<string | undefined>;

  /** The HTML  attribute of the field. */
  "aria-describedby"?: MaybeAccessor<string | undefined>;
}

export function createFormControlField(props: CreateFormControlFieldProps) {
  const context = useFormControlContext();

  props = mergeDefaultProps({ id: context.generateId("field") }, props);

  createEffect(() => onCleanup(context.registerField(access(props.id)!)));

  const fieldProps = createMemo(() => ({
    id: access(props.id),
    "aria-label": access(props["aria-label"]),
    "aria-labelledby": context.getAriaLabelledBy(
      access(props.id),
      access(props["aria-label"]),
      access(props["aria-labelledby"])
    ),
    "aria-describedby": context.getAriaDescribedBy(access(props["aria-describedby"])),
  }));

  return { fieldProps };
}
