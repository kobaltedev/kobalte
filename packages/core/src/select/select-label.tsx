import { callHandler } from "@kobalte/utils";
import { ComponentProps, JSX, splitProps } from "solid-js";

import { FormControlLabel } from "../form-control";
import { As, Polymorphic } from "../polymorphic";
import { useSelectContext } from "./select-context";

/**
 * The label that gives the user information on the select.
 */
export function SelectLabel(props: ComponentProps<"span">) {
  const context = useSelectContext();

  const [local, others] = splitProps(props, ["onClick"]);

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);

    if (!context.isDisabled()) {
      context.triggerRef()?.focus();
    }
  };

  return (
    <FormControlLabel>
      <As component={Polymorphic} fallback="span" onClick={onClick} {...others} />
    </FormControlLabel>
  );
}
