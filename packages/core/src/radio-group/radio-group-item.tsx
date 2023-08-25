/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadio.ts
 */

import {
  callHandler,
  createGenerateId,
  mergeDefaultProps,
  OverrideComponentProps,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, JSX, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { createRegisterId } from "../primitives";
import { useRadioGroupContext } from "./radio-group-context";
import {
  RadioGroupItemContext,
  RadioGroupItemContextValue,
  RadioGroupItemDataSet,
} from "./radio-group-item-context";

export interface RadioGroupItemOptions {
  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string;

  /** Whether the radio button is disabled or not. */
  disabled?: boolean;
}

export interface RadioGroupItemProps extends OverrideComponentProps<"div", RadioGroupItemOptions> {}

/**
 * The root container for a radio button.
 */
export function RadioGroupItem(props: RadioGroupItemProps) {
  const formControlContext = useFormControlContext();
  const radioGroupContext = useRadioGroupContext();

  const defaultId = `${formControlContext.generateId("item")}-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
    },
    props,
  );

  const [local, others] = splitProps(props, ["value", "disabled", "onPointerDown"]);

  const [inputId, setInputId] = createSignal<string>();
  const [labelId, setLabelId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
  const [isFocused, setIsFocused] = createSignal(false);

  const isSelected = createMemo(() => {
    return radioGroupContext.isSelectedValue(local.value);
  });

  const isDisabled = createMemo(() => {
    return local.disabled || formControlContext.isDisabled() || false;
  });

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    // For consistency with native, prevent the input blurs on pointer down.
    if (isFocused()) {
      e.preventDefault();
    }
  };

  const dataset: Accessor<RadioGroupItemDataSet> = createMemo(() => ({
    ...formControlContext.dataset(),
    "data-disabled": isDisabled() ? "" : undefined,
    "data-checked": isSelected() ? "" : undefined,
  }));

  const context: RadioGroupItemContextValue = {
    value: () => local.value,
    dataset,
    isSelected,
    isDisabled,
    inputId,
    labelId,
    descriptionId,
    inputRef,
    select: () => radioGroupContext.setSelectedValue(local.value),
    generateId: createGenerateId(() => others.id!),
    registerInput: createRegisterId(setInputId),
    registerLabel: createRegisterId(setLabelId),
    registerDescription: createRegisterId(setDescriptionId),
    setIsFocused,
    setInputRef,
  };

  return (
    <RadioGroupItemContext.Provider value={context}>
      <Polymorphic as="div" role="group" onPointerDown={onPointerDown} {...dataset()} {...others} />
    </RadioGroupItemContext.Provider>
  );
}
