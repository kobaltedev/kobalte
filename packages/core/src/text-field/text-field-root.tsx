import {
  access,
  composeEventHandlers,
  createGenerateId,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  createFormControl,
  CreateFormControlProps,
  FORM_CONTROL_PROP_NAMES,
  FormControlContext,
} from "../form-control";
import {
  createControllableSignal,
  createFormResetListener,
  createHover,
  HOVER_HANDLERS_PROP_NAMES,
} from "../primitives";
import { TextFieldContext, TextFieldContextValue, TextFieldDataSet } from "./text-field-context";

export interface TextFieldRootOptions extends CreateFormControlProps {
  /** The controlled value of the textfield. */
  value?: string;

  /**
   * The default value when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: string;

  /** Event handler called when the value of the textfield changes. */
  onValueChange?: (value: string) => void;
}

/**
 * A text input that allow users to input custom text entries with a keyboard.
 */
export const TextFieldRoot = createPolymorphicComponent<"div", TextFieldRootOptions>(props => {
  let ref: HTMLDivElement | undefined;

  const defaultId = `textfield-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
    },
    props
  );

  const [local, formControlProps, others] = splitProps(
    props,
    ["as", "ref", "value", "defaultValue", "onValueChange", ...HOVER_HANDLERS_PROP_NAMES],
    FORM_CONTROL_PROP_NAMES
  );

  const [value, setValue] = createControllableSignal({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: value => local.onValueChange?.(value),
  });

  const [isFocused, setIsFocused] = createSignal(false);
  const [isFocusVisible, setIsFocusVisible] = createSignal(false);

  const { formControlContext } = createFormControl(formControlProps);

  createFormResetListener(
    () => ref,
    () => setValue(local.defaultValue ?? "")
  );

  const { isHovered, hoverHandlers } = createHover({
    isDisabled: () => access(formControlProps.isDisabled),
  });

  const onInput: JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, InputEvent> = e => {
    if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
      return;
    }

    const target = e.target as HTMLInputElement | HTMLTextAreaElement;

    setValue(target.value);

    // Unlike in React, inputs `value` can be out of sync with our value state.
    // even if an input is controlled (ex: `<input value="foo" />`,
    // typing on the input will change its internal `value`.
    //
    // To prevent this, we need to force the input `value` to be in sync with the textfield value state.
    target.value = value() ?? "";
  };

  const dataset: Accessor<TextFieldDataSet> = createMemo(() => ({
    "data-hover": isHovered() ? "" : undefined,
    "data-focus": isFocused() ? "" : undefined,
    "data-focus-visible": isFocusVisible() ? "" : undefined,
  }));

  const context: TextFieldContextValue = {
    dataset,
    value,
    generateId: createGenerateId(() => access(formControlProps.id)!),
    setIsFocused,
    setIsFocusVisible,
    onInput,
  };

  return (
    <FormControlContext.Provider value={formControlContext}>
      <TextFieldContext.Provider value={context}>
        <Dynamic
          component={local.as}
          ref={mergeRefs(el => (ref = el), local.ref)}
          role="group"
          onPointerEnter={composeEventHandlers([
            local.onPointerEnter,
            hoverHandlers.onPointerEnter,
          ])}
          onPointerLeave={composeEventHandlers([
            local.onPointerLeave,
            hoverHandlers.onPointerLeave,
          ])}
          {...formControlContext.dataset()}
          {...dataset()}
          {...others}
        />
      </TextFieldContext.Provider>
    </FormControlContext.Provider>
  );
});
