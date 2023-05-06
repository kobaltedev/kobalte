/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0af91c08c745f4bb35b6ad4932ca17a0d85dd02c/packages/@react-aria/textfield/src/useTextField.ts
 * https://github.com/adobe/react-spectrum/blob/0af91c08c745f4bb35b6ad4932ca17a0d85dd02c/packages/@react-spectrum/textfield/src/TextArea.tsx
 */

import { mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, on, splitProps } from "solid-js";

import { AsChildProp } from "../polymorphic";
import { useTextFieldContext } from "./text-field-context";
import { TextFieldInputBase } from "./text-field-input";

export interface TextFieldTextAreaOptions extends AsChildProp {
  /** Whether the textarea should adjust its height when the value changes. */
  autoResize?: boolean;
}

export interface TextFieldTextAreaProps
  extends OverrideComponentProps<"textarea", TextFieldTextAreaOptions> {}

/**
 * The native html textarea of the textfield.
 */
export function TextFieldTextArea(props: TextFieldTextAreaProps) {
  let ref: HTMLTextAreaElement | undefined;

  const context = useTextFieldContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("textarea"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "autoResize"]);

  createEffect(
    on([() => ref, () => local.autoResize, () => context.value()], ([ref, autoResize]) => {
      if (!ref || !autoResize) {
        return;
      }

      adjustHeight(ref);
    })
  );

  return (
    <TextFieldInputBase
      as="textarea"
      ref={mergeRefs(el => (ref = el), local.ref) as any}
      {...(others as any)}
    />
  );
}

/**
 * Adjust the height of the textarea based on its text value.
 */
function adjustHeight(el: HTMLTextAreaElement) {
  const prevAlignment = el.style.alignSelf;
  const prevOverflow = el.style.overflow;

  // Firefox scroll position is lost when `overflow: 'hidden'` is applied, so we skip applying it.
  // The measure/applied height is also incorrect/reset if we turn on and off
  // overflow: hidden in Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1787062
  const isFirefox = "MozAppearance" in el.style;
  if (!isFirefox) {
    el.style.overflow = "hidden";
  }

  el.style.alignSelf = "start";
  el.style.height = "auto";

  // offsetHeight - clientHeight accounts for the border/padding.
  el.style.height = `${el.scrollHeight + (el.offsetHeight - el.clientHeight)}px`;
  el.style.overflow = prevOverflow;
  el.style.alignSelf = prevAlignment;
}
