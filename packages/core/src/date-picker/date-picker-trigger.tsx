import { callHandler, mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createMemo, JSX, splitProps } from "solid-js";

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

  const [local, others] = splitProps(props, ["ref", "disabled", "onClick"]);

  const isDisabled = () => {
    return (
      local.disabled ||
      context.isDisabled() ||
      formControlContext.isDisabled() ||
      formControlContext.isReadOnly()
    );
  };

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    callHandler(e, local.onClick);

    if (!isDisabled()) {
      context.toggle();
    }
  };

  const ariaLabel = createMemo(() => {
    return context.messageFormatter().format("calendar");
  });

  const ariaLabelledBy = () => {
    return formControlContext.getAriaLabelledBy(others.id, ariaLabel(), undefined);
  };

  const ariaDescribedBy = () => {
    // TODO: use date
    //const description = date ? context.messageFormatter().format('selectedDateDescription', {date}) : '';
    const description = context.messageFormatter().format("selectedDateDescription", { date: "" });
    return formControlContext.getAriaDescribedBy(description);
  };

  return (
    <Button.Root
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      disabled={isDisabled()}
      aria-haspopup="dialog"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.contentId() : undefined}
      aria-label={ariaLabel()}
      aria-labelledby={ariaLabelledBy()}
      aria-describedby={ariaDescribedBy()}
      onClick={onClick}
      {...context.dataset()}
      {...others}
    />
  );
}
