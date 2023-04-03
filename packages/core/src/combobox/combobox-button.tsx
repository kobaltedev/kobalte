import { callHandler, mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxButtonProps
  extends OverrideComponentProps<"button", Button.ButtonRootOptions> {}

export function ComboboxButton(props: ComboboxButtonProps) {
  const context = useComboboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("button"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "disabled", "onPointerDown", "onClick"]);

  const isDisabled = () => local.disabled || context.isDisabled();

  const openManual = () => {
    // Focus the input field in case it isn't focused yet.
    context.inputRef()?.focus();
    context.toggle(true, "manual");
  };

  const onPointerDown: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    e.currentTarget.dataset.pointerType = e.pointerType;

    // For consistency with native, open the combobox on mouse down, but touch up.
    if (!isDisabled() && e.pointerType !== "touch") {
      openManual();
    }
  };

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    callHandler(e, local.onClick);

    if (!isDisabled() && e.currentTarget.dataset.pointerType === "touch") {
      openManual();
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
      onPointerDown={onPointerDown}
      onClick={onClick}
      {...context.dataset()}
      {...others}
    />
  );
}
