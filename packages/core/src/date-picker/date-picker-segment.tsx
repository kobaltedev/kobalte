/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/datepicker/src/useDateSegment.ts
 */

import { mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useDatePickerContext } from "./date-picker-context";
import { useDatePickerInputContext } from "./date-picker-input-context";
import { DateSegment } from "./types";

export interface DatePickerSegmentOptions {
  segment: DateSegment;
}

export interface DatePickerSegmentProps
  extends OverrideComponentProps<"div", DatePickerSegmentOptions> {}

export function DatePickerSegment(props: DatePickerSegmentProps) {
  let ref: HTMLDivElement | undefined;

  const formControlContext = useFormControlContext();
  const datePickerContext = useDatePickerContext();
  const inputContext = useDatePickerInputContext();

  const [local, others] = splitProps(props, ["ref", "segment"]);

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(el => (ref = el), local.ref)}
      {...datePickerContext.dataset()}
      {...formControlContext.dataset()}
      {...others}
    />
  );
}
