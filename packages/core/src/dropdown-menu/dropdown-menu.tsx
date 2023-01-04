import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, ParentComponent } from "solid-js";

import {
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
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "../menu";
import { Popper } from "../popper";
import { Separator } from "../separator";
import { DropdownMenuContent } from "./dropdown-menu-content";

export type DropdownMenuComposite = {
  Trigger: typeof MenuTrigger;
  Icon: typeof MenuIcon;
  Portal: typeof MenuPortal;
  Content: typeof DropdownMenuContent;
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
  SubContent: typeof MenuSubContent;
  SubTrigger: typeof MenuSubTrigger;
};

export interface DropdownMenuOptions extends MenuRootProps {}

/**
 * Displays a menu to the user —such as a set of actions or functions— triggered by a button.
 */
export const DropdownMenu: ParentComponent<DropdownMenuOptions> & DropdownMenuComposite = props => {
  const defaultId = `dropdownmenu-${createUniqueId()}`;

  props = mergeDefaultProps({ id: defaultId }, props);

  return <MenuRoot {...props} />;
};

DropdownMenu.Trigger = MenuTrigger;
DropdownMenu.Icon = MenuIcon;
DropdownMenu.Portal = MenuPortal;
DropdownMenu.Content = DropdownMenuContent;
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
DropdownMenu.SubContent = MenuSubContent;
DropdownMenu.SubTrigger = MenuSubTrigger;
