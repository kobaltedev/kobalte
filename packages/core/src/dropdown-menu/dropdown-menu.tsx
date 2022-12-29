import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, ParentComponent } from "solid-js";

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
  MenuTrigger,
} from "../menu";
import { MenuPortal } from "../menu/menu-portal";
import { MenuPositioner } from "../menu/menu-positioner";
import { Popper } from "../popper";
import { Separator } from "../separator";

export type DropdownMenuComposite = {
  Trigger: typeof MenuTrigger;
  Icon: typeof MenuIcon;
  Portal: typeof MenuPortal;
  Positioner: typeof MenuPositioner;
  Content: typeof MenuContent;
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
  Sub: typeof MenuSub;
  SubTrigger: typeof MenuSubTrigger;
};

/**
 * Displays a menu to the user —such as a set of actions or functions— triggered by a button.
 */
export const DropdownMenu: ParentComponent<MenuRootProps> & DropdownMenuComposite = props => {
  const defaultId = `dropdownmenu-${createUniqueId()}`;

  props = mergeDefaultProps({ id: defaultId }, props);

  return <MenuRoot {...props} />;
};

DropdownMenu.Trigger = MenuTrigger;
DropdownMenu.Icon = MenuIcon;
DropdownMenu.Portal = MenuPortal;
DropdownMenu.Positioner = MenuPositioner;
DropdownMenu.Content = MenuContent;
DropdownMenu.Arrow = Popper.Arrow;
DropdownMenu.Separator = Separator;
DropdownMenu.Group = MenuGroup;
DropdownMenu.GroupLabel = MenuGroupLabel;
DropdownMenu.Item = MenuItem;
DropdownMenu.ItemLabel = MenuItemLabel;
DropdownMenu.ItemDescription = MenuItemDescription;
DropdownMenu.ItemIndicator = MenuItemIndicator;
DropdownMenu.RadioGroup = MenuRadioGroup;
DropdownMenu.RadioItem = MenuRadioItem;
DropdownMenu.CheckboxItem = MenuCheckboxItem;
DropdownMenu.Sub = MenuSub;
DropdownMenu.SubTrigger = MenuSubTrigger;
