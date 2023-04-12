import { mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useDatePickerContext } from "./date-picker-context";

export interface DatePickerControlOptions {}

export interface DatePickerControlProps
  extends OverrideComponentProps<"div", DatePickerControlOptions> {}

/**
 * Contains the date picker input and trigger.
 */
export function DatePickerControl(props: DatePickerControlProps) {
  const formControlContext = useFormControlContext();
  const context = useDatePickerContext();

  const [local, others] = splitProps(props, ["ref"]);

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(context.setControlRef, local.ref)}
      {...context.dataset()}
      {...formControlContext.dataset()}
      {...others}
    />
  );
}
