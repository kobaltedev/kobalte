import { mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import * as Listbox from "../listbox";
import { useSelectContext } from "./select-context";

export interface SelectListboxOptions<Option, OptGroup = never>
  extends Pick<
    Listbox.ListboxRootOptions<Option, OptGroup>,
    "scrollRef" | "scrollToItem" | "children"
  > {}

export type SelectListboxProps<Option, OptGroup = never> = OverrideComponentProps<
  "ul",
  SelectListboxOptions<Option, OptGroup>
>;

/**
 * Contains all the items of a `Select`.
 */
export function SelectListbox<Option = any, OptGroup = never>(
  props: SelectListboxProps<Option, OptGroup>
) {
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("listbox"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id"]);

  createEffect(() => onCleanup(context.registerListboxId(local.id!)));

  /*
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
  */

  return (
    <Listbox.Root
      ref={mergeRefs(context.setListboxRef, local.ref)}
      id={local.id}
      state={context.listState()}
      isVirtualized={context.isVirtualized()}
      autoFocus={context.autoFocus()}
      shouldSelectOnPressUp
      shouldFocusOnHover
      aria-labelledby={context.listboxAriaLabelledBy()}
      renderItem={context.renderItem}
      renderSection={context.renderSection}
      {...others}
    />
  );
}
