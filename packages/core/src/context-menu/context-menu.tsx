/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/context-menu/src/ContextMenu.tsx
 */

import { mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuIcon,
  MenuItem,
  MenuItemDescription,
  MenuItemIndicator,
  MenuItemLabel,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuRootProps,
  MenuSubContent,
  MenuSubTrigger,
} from "../menu";
import { Popper } from "../popper";
import { createDisclosureState } from "../primitives";
import { Separator } from "../separator";
import { ContextMenuContent } from "./context-menu-content";
import { ContextMenuContext, ContextMenuContextValue } from "./context-menu-context";
import { ContextMenuTrigger } from "./context-menu-trigger";

type ContextMenuComposite = {
  Trigger: typeof ContextMenuTrigger;
  Icon: typeof MenuIcon;
  Portal: typeof MenuPortal;
  Content: typeof ContextMenuContent;
  Arrow: typeof Popper.Arrow;
  Separator: typeof Separator;
  Group: typeof MenuGroup;
  GroupLabel: typeof MenuGroupLabel;
  Item: typeof MenuItem;
  ItemLabel: typeof MenuItemLabel;
  ItemDescription: typeof MenuItemDescription;
  ItemIndicator: typeof MenuItemIndicator;
  RadioGroup: typeof MenuRadioGroup;
  RadioItem: typeof MenuRadioItem;
  CheckboxItem: typeof MenuCheckboxItem;
  Sub: typeof Menu;
  SubContent: typeof MenuSubContent;
  SubTrigger: typeof MenuSubTrigger;
};

export interface ContextMenuProps
  extends Omit<MenuRootProps, "isOpen" | "defaultIsOpen" | "getAnchorRect"> {}

/**
 * Displays a menu located at the pointer, triggered by a right-click or a long-press.
 */
export const ContextMenu: ParentComponent<ContextMenuProps> & ContextMenuComposite = props => {
  const defaultId = `contextmenu-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      placement: "right-start",
      gutter: 2,
      shift: 2,
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
      <MenuRoot
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
ContextMenu.Portal = MenuPortal;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Arrow = Popper.Arrow;
ContextMenu.Separator = Separator;
ContextMenu.Group = MenuGroup;
ContextMenu.GroupLabel = MenuGroupLabel;
ContextMenu.Item = MenuItem;
ContextMenu.ItemLabel = MenuItemLabel;
ContextMenu.ItemDescription = MenuItemDescription;
ContextMenu.ItemIndicator = MenuItemIndicator;
ContextMenu.RadioGroup = MenuRadioGroup;
ContextMenu.RadioItem = MenuRadioItem;
ContextMenu.CheckboxItem = MenuCheckboxItem;
ContextMenu.Sub = Menu;
ContextMenu.SubContent = MenuSubContent;
ContextMenu.SubTrigger = MenuSubTrigger;
