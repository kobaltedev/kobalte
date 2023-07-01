/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/datepicker/src/useDateSegment.ts
 */

import { mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { children, Show, splitProps } from "solid-js";

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

  const [local, others] = splitProps(props, ["ref", "segment", "children"]);

  const resolvedChildren = children(() => local.children);

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(el => (ref = el), local.ref)}
      data-placeholder={local.segment.isPlaceholder ? "" : undefined}
      {...datePickerContext.dataset()}
      {...formControlContext.dataset()}
      {...others}
    >
      <Show when={resolvedChildren()} fallback={local.segment.text}>
        {resolvedChildren()}
      </Show>
    </Polymorphic>
  );
}

function commonPrefixLength(strings: string[]): number {
  // Sort the strings, and compare the characters in the first and last to find the common prefix.
  strings.sort();

  const first = strings[0];
  const last = strings[strings.length - 1];

  for (let i = 0; i < first.length; i++) {
    if (first[i] !== last[i]) {
      return i;
    }
  }

  return 0;
}
