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
  FormControlDescription,
  FormControlErrorMessage,
  FormControlLabel,
} from "../form-control";
import {
  createControllableSignal,
  createFormResetListener,
  createHover,
  HOVER_HANDLERS_PROP_NAMES,
} from "../primitives";
import { TextFieldContext, TextFieldContextValue, TextFieldDataSet } from "./text-field-context";
import { TextFieldInput } from "./text-field-input";
import { TextFieldTextArea } from "./text-field-text-area";

type TextFieldComposite = {
  Label: typeof FormControlLabel;
  Input: typeof TextFieldInput;
  TextArea: typeof TextFieldTextArea;
  Description: typeof FormControlDescription;
  ErrorMessage: typeof FormControlErrorMessage;
};

export interface TextFieldOptions extends CreateFormControlProps {
  /** The controlled input value of the textfield. */
  value?: string;

  /**
   * The default input value when initially rendered.
   * Useful when you do not need to control the input value.
   */
  defaultValue?: string;

  /** Event handler called when the input value of the textfield changes. */
  onValueChange?: (value: string) => void;
}

/**
 * A text input that allow users to input custom text entries with a keyboard.
 */
export const TextField = createPolymorphicComponent<"div", TextFieldOptions, TextFieldComposite>(
  props => {
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

    const onInput: JSX.EventHandlerUnion<
      HTMLInputElement | HTMLTextAreaElement,
      InputEvent
    > = e => {
      const newValue = (e.target as HTMLInputElement).value;
      setValue(newValue);
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
  }
);

TextField.Label = FormControlLabel;
TextField.Input = TextFieldInput;
TextField.TextArea = TextFieldTextArea;
TextField.Description = FormControlDescription;
TextField.ErrorMessage = FormControlErrorMessage;
