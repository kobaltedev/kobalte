import { access, MaybeAccessor, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";

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

export const FORM_CONTROL_FIELD_PROP_NAMES = [
  "id",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
] as const;

export function createFormControlField(props: CreateFormControlFieldProps) {
  const context = useFormControlContext();

  props = mergeDefaultProps({ id: context.generateId("field") }, props);

  createEffect(() => onCleanup(context.registerField(access(props.id)!)));

  return {
    fieldProps: {
      id: () => access(props.id),
      ariaLabel: () => access(props["aria-label"]),
      ariaLabelledBy: () =>
        context.getAriaLabelledBy(
          access(props.id),
          access(props["aria-label"]),
          access(props["aria-labelledby"])
        ),
      ariaDescribedBy: () => context.getAriaDescribedBy(access(props["aria-describedby"])),
    },
  };
}
