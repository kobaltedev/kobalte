import { callHandler, EventKey, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSwitchContext } from "./switch-context";

export interface SwitchControlProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The element that visually represents a switch.
 */
export function SwitchControl(props: SwitchControlProps) {
  const formControlContext = useFormControlContext();
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props,
  );

  const [local, others] = splitProps(props, ["onClick", "onKeyDown"]);

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);

    context.toggle();
    context.inputRef()?.focus();
  };

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    if (e.key === EventKey.Space) {
      context.toggle();
      context.inputRef()?.focus();
    }
  };

  return (
    <Polymorphic
      as="div"
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...formControlContext.dataset()}
      {...context.dataset()}
      {...others}
    />
  );
}
