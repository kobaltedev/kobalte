import { callHandler, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import { Listbox, ListboxProps } from "../listbox";
import { useSelectContext } from "./select-context";

export interface SelectMenuProps extends ListboxProps {}

export const SelectMenu = createPolymorphicComponent<"ul", SelectMenuProps>(props => {
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("listbox"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "onFocusOut"]);

  createEffect(() => onCleanup(context.registerListbox(local.id!)));

  const onFocusOut: JSX.EventHandlerUnion<HTMLUListElement, FocusEvent> = e => {
    callHandler(e, local.onFocusOut);

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    callHandler(e, context.onListboxFocusOut);
  };

  return (
    <Listbox
      id={local.id}
      state={context.listState()}
      autoFocus={context.autoFocus()}
      shouldSelectOnPressUp
      shouldFocusOnHover
      //aria-labelledby={}
      onFocusOut={onFocusOut}
      {...others}
    />
  );
});
