import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, onMount, splitProps } from "solid-js";

import { Listbox, ListboxOptions } from "../listbox";
import { useSelectContext } from "./select-context";

export interface SelectListboxOptions extends Pick<ListboxOptions, "scrollRef"> {}

/**
 * Contains all the items of a `Select`.
 */
export const SelectListbox = createPolymorphicComponent<"div", SelectListboxOptions>(props => {
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("listbox"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id"]);

  createEffect(() => onCleanup(context.registerListboxId(local.id!)));

  onMount(() => {
    if (!context.isOpen() || context.autoFocus() === false) {
      return;
    }

    let focusedKey = context.listState().selectionManager().firstSelectedKey();

    if (focusedKey == null) {
      if (context.autoFocus() === "first") {
        focusedKey = context.listState().collection().getFirstKey();
      } else if (context.autoFocus() === "last") {
        focusedKey = context.listState().collection().getLastKey();
      }
    }

    context.listState().selectionManager().setFocused(true);
    context.listState().selectionManager().setFocusedKey(focusedKey);
  });

  return (
    <Listbox
      ref={mergeRefs(context.setListboxRef, local.ref)}
      id={local.id}
      items={context.items()}
      state={context.listState()}
      autoFocus={context.isOpen() ? context.autoFocus() : false}
      shouldSelectOnPressUp
      shouldFocusOnHover
      aria-labelledby={context.listboxAriaLabelledBy()}
      onItemsChange={context.setItems}
      {...others}
    />
  );
});
