import { mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import { Menu, MenuComposite, MenuProps } from "../menu";
import { MenuGroup } from "../menu/menu-group";
import { MenuGroupLabel } from "../menu/menu-group-label";
import { MenuIcon } from "../menu/menu-icon";
import { MenuItem } from "../menu/menu-item";
import { MenuItemCheckbox } from "../menu/menu-item-checkbox";
import { MenuItemDescription } from "../menu/menu-item-description";
import { MenuItemIndicator } from "../menu/menu-item-indicator";
import { MenuItemLabel } from "../menu/menu-item-label";
import { MenuItemRadio } from "../menu/menu-item-radio";
import { MenuPanel } from "../menu/menu-panel";
import { MenuRadioGroup } from "../menu/menu-radio-group";
import { MenuSub } from "../menu/menu-sub";
import { MenuSubTrigger } from "../menu/menu-sub-trigger";
import { PopoverArrow } from "../popover/popover-arrow";
import { PopoverPortal } from "../popover/popover-portal";
import { PopoverPositioner } from "../popover/popover-positioner";
import { createDisclosure } from "../primitives";
import { ContextMenuContext, ContextMenuContextValue } from "./context-menu-context";
import { ContextMenuTrigger } from "./context-menu-trigger";

type ContextMenuComposite = {
  Trigger: typeof ContextMenuTrigger;
} & Omit<MenuComposite, "Trigger">;

export interface ContextMenuProps
  extends Omit<MenuProps, "isOpen" | "defaultIsOpen" | "getAnchorRect"> {}

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

  const disclosureState = createDisclosure({
    defaultIsOpen: false,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const context: ContextMenuContextValue = {
    open: disclosureState.open,
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
ContextMenu.Icon = MenuIcon;
ContextMenu.Portal = PopoverPortal;
ContextMenu.Positioner = PopoverPositioner;
ContextMenu.Panel = MenuPanel;
ContextMenu.Arrow = PopoverArrow;
ContextMenu.Group = MenuGroup;
ContextMenu.GroupLabel = MenuGroupLabel;
ContextMenu.Item = MenuItem;
ContextMenu.ItemLabel = MenuItemLabel;
ContextMenu.ItemDescription = MenuItemDescription;
ContextMenu.ItemIndicator = MenuItemIndicator;
ContextMenu.RadioGroup = MenuRadioGroup;
ContextMenu.ItemRadio = MenuItemRadio;
ContextMenu.ItemCheckbox = MenuItemCheckbox;
ContextMenu.Sub = MenuSub;
ContextMenu.SubTrigger = MenuSubTrigger;
