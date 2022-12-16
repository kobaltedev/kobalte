import { ParentComponent } from "solid-js";

import { HoverCard } from "../hover-card";
import { Separator } from "../separator";
import { MenuBase, MenuBaseProps } from "./menu-base";
import { MenuGroup } from "./menu-group";
import { MenuGroupLabel } from "./menu-group-label";
import { MenuIcon } from "./menu-icon";
import { MenuItem } from "./menu-item";
import { MenuItemCheckbox } from "./menu-item-checkbox";
import { MenuItemDescription } from "./menu-item-description";
import { MenuItemIndicator } from "./menu-item-indicator";
import { MenuItemLabel } from "./menu-item-label";
import { MenuItemRadio } from "./menu-item-radio";
import { MenuPanel } from "./menu-panel";
import { MenuRadioGroup } from "./menu-radio-group";
import { MenuSub } from "./menu-sub";
import { MenuSubTrigger } from "./menu-sub-trigger";
import { MenuTrigger } from "./menu-trigger";

export type MenuComposite = {
  Trigger: typeof MenuTrigger;
  Icon: typeof MenuIcon;
  Portal: typeof HoverCard.Portal;
  Positioner: typeof HoverCard.Positioner;
  Panel: typeof MenuPanel;
  Arrow: typeof HoverCard.Arrow;
  Separator: typeof Separator;
  Group: typeof MenuGroup;
  GroupLabel: typeof MenuGroupLabel;
  Item: typeof MenuItem;
  ItemLabel: typeof MenuItemLabel;
  ItemDescription: typeof MenuItemDescription;
  ItemIndicator: typeof MenuItemIndicator;
  RadioGroup: typeof MenuRadioGroup;
  ItemRadio: typeof MenuItemRadio;
  ItemCheckbox: typeof MenuItemCheckbox;
  Sub: typeof MenuSub;
  SubTrigger: typeof MenuSubTrigger;
};

/**
 * A menu displays a menu to the user—such as a set of actions or functions—triggered by a button.
 */
export const Menu: ParentComponent<MenuBaseProps> & MenuComposite = props => {
  return <MenuBase {...props} />;
};

Menu.Trigger = MenuTrigger;
Menu.Icon = MenuIcon;
Menu.Portal = HoverCard.Portal;
Menu.Positioner = HoverCard.Positioner;
Menu.Panel = MenuPanel;
Menu.Arrow = HoverCard.Arrow;
Menu.Separator = Separator;
Menu.Group = MenuGroup;
Menu.GroupLabel = MenuGroupLabel;
Menu.Item = MenuItem;
Menu.ItemLabel = MenuItemLabel;
Menu.ItemDescription = MenuItemDescription;
Menu.ItemIndicator = MenuItemIndicator;
Menu.RadioGroup = MenuRadioGroup;
Menu.ItemRadio = MenuItemRadio;
Menu.ItemCheckbox = MenuItemCheckbox;
Menu.Sub = MenuSub;
Menu.SubTrigger = MenuSubTrigger;
