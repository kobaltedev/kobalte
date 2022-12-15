import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useMenuContext } from "../menu/menu-context";
import { useContextMenuContext } from "./context-menu-context";

export const ContextMenuTrigger = createPolymorphicComponent<"div">(props => {
  const menuContext = useMenuContext();
  const context = useContextMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: menuContext.generateId("trigger"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref"]);

  const onContextMenu: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    e.preventDefault();

    context.setAnchorRect({ x: e.clientX, y: e.clientY });

    if (menuContext.isOpen()) {
      // If the menu is already open, focus the menu itself.
      menuContext.focusPanel();
      menuContext.listState().selectionManager().setFocused(true);
      menuContext.listState().selectionManager().setFocusedKey(undefined);
    } else {
      menuContext.open();
    }
  };

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(menuContext.setTriggerRef, local.ref)}
      data-expanded={menuContext.isOpen() ? "" : undefined}
      onContextMenu={onContextMenu}
      {...others}
    />
  );
});
