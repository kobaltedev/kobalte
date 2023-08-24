import { callHandler, EventKey, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useRadioGroupItemContext } from "./radio-group-item-context";

export interface RadioGroupItemControlProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The element that visually represents a radio button.
 */
export function RadioGroupItemControl(props: RadioGroupItemControlProps) {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props,
  );

  const [local, others] = splitProps(props, ["onClick", "onKeyDown"]);

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);

    context.select();
    context.inputRef()?.focus();
  };

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    if (e.key === EventKey.Space) {
      context.select();
      context.inputRef()?.focus();
    }
  };

  return (
    <Polymorphic
      as="div"
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...context.dataset()}
      {...others}
    />
  );
}
