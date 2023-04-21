import { callHandler, mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, createMemo, JSX, onCleanup, splitProps } from "solid-js";

import * as Button from "../button";
import { useFormControlContext } from "../form-control";
import { useDatePickerContext } from "./date-picker-context";

export interface DatePickerTriggerProps
  extends OverrideComponentProps<"button", Button.ButtonRootOptions> {}

export function DatePickerTrigger(props: DatePickerTriggerProps) {
  const formControlContext = useFormControlContext();
  const context = useDatePickerContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("trigger"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "disabled",
    "onPointerDown",
    "onClick",
    "aria-labelledby",
  ]);

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

    // Prevent pointer events from reaching `DatePicker.Control`.
    e.stopPropagation();
  };

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    callHandler(e, local.onClick);

    // Prevent click events from reaching `DatePicker.Control`.
    e.stopPropagation();

    if (!isDisabled()) {
      context.toggle();
    }
  };

  const ariaLabel = createMemo(() => {
    return context.messageFormatter().format("calendar");
  });

  const ariaLabelledBy = () => {
    return formControlContext.getAriaLabelledBy(others.id, ariaLabel(), local["aria-labelledby"]);
  };

  createEffect(() => onCleanup(context.registerTriggerId(others.id!)));

  return (
    <Button.Root
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      disabled={isDisabled()}
      aria-haspopup="dialog"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.contentId() : undefined}
      aria-label={ariaLabel()}
      aria-labelledby={ariaLabelledBy()}
      aria-describedby={context.ariaDescribedBy()}
      onPointerDown={onPointerDown}
      onClick={onClick}
      {...context.dataset()}
      {...others}
    />
  );
}
