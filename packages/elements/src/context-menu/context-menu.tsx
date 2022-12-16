import { mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import { Menu, MenuComposite } from "../menu";
import { MenuBaseProps } from "../menu/menu-base";
import { createDisclosureState } from "../primitives";
import { ContextMenuContext, ContextMenuContextValue } from "./context-menu-context";
import { ContextMenuTrigger } from "./context-menu-trigger";

type ContextMenuComposite = {
  Trigger: typeof ContextMenuTrigger;
} & Omit<MenuComposite, "Trigger">;

export interface ContextMenuProps
  extends Omit<MenuBaseProps, "isOpen" | "defaultIsOpen" | "getAnchorRect"> {}

/**
 * Displays a menu located at the pointer, triggered by a right-click or a long-press.
 */
export const ContextMenu: ParentComponent<ContextMenuProps> & ContextMenuComposite = props => {
  const defaultId = `contextmenu-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      placement: "bottom-start",
    },
    props
  );

  const [local, others] = splitProps(props, ["onOpenChange"]);

  const [anchorRect, setAnchorRect] = createSignal({ x: 0, y: 0 });

  const disclosureState = createDisclosureState({
    defaultIsOpen: false,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const context: ContextMenuContextValue = {
    setAnchorRect,
  };

  return (
    <ContextMenuContext.Provider value={context}>
      <Menu
        isOpen={disclosureState.isOpen()}
        onOpenChange={disclosureState.setIsOpen}
        getAnchorRect={anchorRect}
        {...others}
      />
    </ContextMenuContext.Provider>
  );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Icon = Menu.Icon;
ContextMenu.Portal = Menu.Portal;
ContextMenu.Positioner = Menu.Positioner;
ContextMenu.Panel = Menu.Panel;
ContextMenu.Arrow = Menu.Arrow;
ContextMenu.Separator = Menu.Separator;
ContextMenu.Group = Menu.Group;
ContextMenu.GroupLabel = Menu.GroupLabel;
ContextMenu.Item = Menu.Item;
ContextMenu.ItemLabel = Menu.ItemLabel;
ContextMenu.ItemDescription = Menu.ItemDescription;
ContextMenu.ItemIndicator = Menu.ItemIndicator;
ContextMenu.RadioGroup = Menu.RadioGroup;
ContextMenu.ItemRadio = Menu.ItemRadio;
ContextMenu.ItemCheckbox = Menu.ItemCheckbox;
ContextMenu.Sub = Menu.Sub;
ContextMenu.SubTrigger = Menu.SubTrigger;
