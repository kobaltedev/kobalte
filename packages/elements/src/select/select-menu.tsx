import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

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

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerListbox(local.id!)));

  return (
    <Listbox
      id={local.id}
      state={context.listState()}
      autoFocus={context.autoFocus()}
      shouldSelectOnPressUp
      shouldFocusOnHover
      //aria-labelledby={}
      {...others}
    />
  );
});
