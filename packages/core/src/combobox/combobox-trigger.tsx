import { mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import * as Button from "../button";
import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxTriggerProps
  extends OverrideComponentProps<"div", Button.ButtonRootOptions> {}

/**
 * Contains the combobox input and button.
 */
export function ComboboxTrigger(props: ComboboxTriggerProps) {
  const formControlContext = useFormControlContext();
  const context = useComboboxContext();

  const [local, others] = splitProps(props, ["ref"]);

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      {...context.dataset()}
      {...formControlContext.dataset()}
      {...others}
    />
  );
}
