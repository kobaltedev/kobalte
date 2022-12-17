import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { Listbox } from "../listbox";
import { useSelectContext } from "./select-context";

export const SelectListbox = createPolymorphicComponent<"div">(props => {
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("listbox"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id"]);

  createEffect(() => onCleanup(context.registerListbox(local.id!)));

  return (
    <Listbox
      ref={mergeRefs(context.setListboxRef, local.ref)}
      id={local.id}
      items={context.items()}
      state={context.listState()}
      autoFocus={context.autoFocus()}
      shouldSelectOnPressUp
      shouldFocusOnHover
      aria-labelledby={context.menuAriaLabelledBy()}
      onItemsChange={context.setItems}
      {...others}
    />
  );
});
