import { combineProps, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { createSelectableList } from "../list";
import { PopoverContent, PopoverContentOptions } from "../popover/popover-content";
import { createFocusRing, FocusOutsideEvent } from "../primitives";
import { useMenuContext } from "./menu-context";

export const MenuContent = createPolymorphicComponent<"div", PopoverContentOptions>(props => {
  let ref: HTMLDivElement | undefined;

  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("content"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id"]);

  const selectableList = createSelectableList(
    {
      selectionManager: context.listState().selectionManager,
      collection: context.listState().collection,
      autoFocus: context.autoFocus,
      deferAutoFocus: true, // ensure all menu items are mounted and collection is not empty before trying to autofocus.
      shouldFocusWrap: true,
      disallowTypeAhead: () => !context.listState().selectionManager().isFocused(),
    },
    () => ref
  );

  const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing();

  const onFocusOutside = (e: FocusOutsideEvent) => {
    context.listState().selectionManager().setFocusedKey(undefined);

    if (context.parentMenuContext() != null) {
      if (e.target !== context.triggerRef()) {
        context.close();
      }
    } else {
      if (context.isModal()) {
        e.preventDefault();
      }
    }
  };

  createEffect(() => onCleanup(context.registerContentId(local.id!)));

  return (
    <PopoverContent
      id={local.id}
      role="menu"
      tabIndex={selectableList.tabIndex()}
      aria-labelledby={context.triggerId()}
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      onEscapeKeyDown={() => context.close(true)}
      {...combineProps(
        {
          ref: el => {
            context.setContentRef(el);
            ref = el;
          },
        },
        others,
        { onFocusOutside },
        selectableList.handlers,
        focusRingHandlers
      )}
    />
  );
});
