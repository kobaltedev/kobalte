import { mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import { HoverCard } from "../hover-card";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuIcon,
  MenuItem,
  MenuItemDescription,
  MenuItemIndicator,
  MenuItemLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuRootProps,
  MenuSub,
  MenuSubTrigger,
} from "../menu";
import { createDisclosureState } from "../primitives";
import { Separator } from "../separator";
import { ContextMenuContext, ContextMenuContextValue } from "./context-menu-context";
import { ContextMenuTrigger } from "./context-menu-trigger";

type ContextMenuComposite = {
  Trigger: typeof ContextMenuTrigger;
  Icon: typeof MenuIcon;
  Portal: typeof HoverCard.Portal;
  Positioner: typeof HoverCard.Positioner;
  Content: typeof MenuContent;
  Arrow: typeof HoverCard.Arrow;
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
  Sub: typeof MenuSub;
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
ContextMenu.Portal = HoverCard.Portal;
ContextMenu.Positioner = HoverCard.Positioner;
ContextMenu.Content = MenuContent;
ContextMenu.Arrow = HoverCard.Arrow;
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
ContextMenu.Sub = MenuSub;
ContextMenu.SubTrigger = MenuSubTrigger;
