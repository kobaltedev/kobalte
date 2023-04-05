import { callHandler, mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { useFormControlContext } from "../form-control";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxButtonProps
  extends OverrideComponentProps<"button", Button.ButtonRootOptions> {}

export function ComboboxButton(props: ComboboxButtonProps) {
  const formControlContext = useFormControlContext();
  const context = useComboboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("button"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "disabled", "onPointerDown", "onClick"]);

  const isDisabled = () => {
    return (
      local.disabled ||
      context.isDisabled() ||
      formControlContext.isDisabled() ||
      formControlContext.isReadOnly()
    );
  };

  const onPointerDown: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    e.currentTarget.dataset.pointerType = e.pointerType;

    // For consistency with native, open the combobox on mouse down, but touch up.
    if (!isDisabled() && e.pointerType !== "touch") {
      context.toggle(false, "manual");
    }
  };

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    callHandler(e, local.onClick);

    if (!isDisabled()) {
      if (e.currentTarget.dataset.pointerType === "touch") {
        context.toggle(false, "manual");
      }

      // Focus the input field in case it isn't focused yet.
      context.inputRef()?.focus();
    }
  };

  return (
    <Button.Root
      ref={mergeRefs(context.setButtonRef, local.ref)}
      disabled={isDisabled()}
      tabIndex="-1"
      aria-haspopup="listbox"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.listboxId() : undefined}
      aria-label={context.buttonAriaLabel()}
      aria-labelledby={formControlContext.labelId()}
      onPointerDown={onPointerDown}
      onClick={onClick}
      {...context.dataset()}
      {...others}
    />
  );
}
