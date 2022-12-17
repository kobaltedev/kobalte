import { combineProps, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import { HoverCardPanel } from "../hover-card/hover-card-panel";
import { createSelectableList } from "../list";
import { PopoverPanelProps } from "../popover/popover-panel";
import { createFocusRing } from "../primitives";
import { useMenuContext } from "./menu-context";

export const MenuPanel = createPolymorphicComponent<"div", PopoverPanelProps>(props => {
  let ref: HTMLDivElement | undefined;

  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("panel"),
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

  const onFocusOut: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    if (!e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
      context.listState().selectionManager().setFocusedKey(undefined);
    }
  };

  createEffect(() => onCleanup(context.registerPanel(local.id!)));

  return (
    <HoverCardPanel
      id={local.id}
      role="menu"
      tabIndex={selectableList.tabIndex()}
      aria-labelledby={context.triggerId()}
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      {...combineProps(
        {
          ref: el => {
            context.setPanelRef(el);
            ref = el;
          },
        },
        others,
        { onFocusOut },
        selectableList.handlers,
        focusRingHandlers
      )}
    />
  );
});
