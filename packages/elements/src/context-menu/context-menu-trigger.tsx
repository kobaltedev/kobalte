import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useMenuContext } from "../menu/menu-context";
import { useContextMenuContext } from "./context-menu-context";

export const ContextMenuTrigger = createPolymorphicComponent<"div">(props => {
  const contextMenuContext = useContextMenuContext();
  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("trigger"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref"]);

  const onContextMenu: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    e.preventDefault();

    contextMenuContext.setAnchorRect({ x: e.clientX, y: e.clientY });
    contextMenuContext.open();
  };

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      data-expanded={context.isOpen() ? "" : undefined}
      onContextMenu={onContextMenu}
      {...others}
    />
  );
});
