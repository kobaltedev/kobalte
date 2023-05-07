import { callHandler, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { FormControlLabel } from "../form-control/index.jsx";
import { AsChildProp } from "../polymorphic/index.jsx";
import { useSelectContext } from "./select-context.jsx";

export interface SelectLabelProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * The label that gives the user information on the select.
 */
export function SelectLabel(props: SelectLabelProps) {
  const context = useSelectContext();

  const [local, others] = splitProps(props, ["onClick"]);

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);

    if (!context.isDisabled()) {
      context.triggerRef()?.focus();
    }
  };

  return <FormControlLabel as="span" onClick={onClick} {...(others as any)} />;
}
