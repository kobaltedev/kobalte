import {
	MenuCheckboxItem as CheckboxItem,
	type MenuCheckboxItemCommonProps as DropdownMenuCheckboxItemCommonProps,
	type MenuCheckboxItemOptions as DropdownMenuCheckboxItemOptions,
	type MenuCheckboxItemProps as DropdownMenuCheckboxItemProps,
	type MenuCheckboxItemRenderProps as DropdownMenuCheckboxItemRenderProps,
	MenuGroup as Group,
	type MenuGroupCommonProps as DropdownMenuGroupCommonProps,
	MenuGroupLabel as GroupLabel,
	type MenuGroupLabelCommonProps as DropdownMenuGroupLabelCommonProps,
	type MenuGroupLabelOptions as DropdownMenuGroupLabelOptions,
	type MenuGroupLabelProps as DropdownMenuGroupLabelProps,
	type MenuGroupLabelRenderProps as DropdownMenuGroupLabelRenderProps,
	type MenuGroupOptions as DropdownMenuGroupOptions,
	type MenuGroupProps as DropdownMenuGroupProps,
	type MenuGroupRenderProps as DropdownMenuGroupRenderProps,
	MenuIcon as Icon,
	type MenuIconCommonProps as DropdownMenuIconCommonProps,
	type MenuIconOptions as DropdownMenuIconOptions,
	type MenuIconProps as DropdownMenuIconProps,
	type MenuIconRenderProps as DropdownMenuIconRenderProps,
	MenuItem as Item,
	type MenuItemCommonProps as DropdownMenuItemCommonProps,
	MenuItemDescription as ItemDescription,
	type MenuItemDescriptionCommonProps as DropdownMenuItemDescriptionCommonProps,
	type MenuItemDescriptionOptions as DropdownMenuItemDescriptionOptions,
	type MenuItemDescriptionProps as DropdownMenuItemDescriptionProps,
	type MenuItemDescriptionRenderProps as DropdownMenuItemDescriptionRenderProps,
	MenuItemIndicator as ItemIndicator,
	type MenuItemIndicatorCommonProps as DropdownMenuItemIndicatorCommonProps,
	type MenuItemIndicatorOptions as DropdownMenuItemIndicatorOptions,
	type MenuItemIndicatorProps as DropdownMenuItemIndicatorProps,
	type MenuItemIndicatorRenderProps as DropdownMenuItemIndicatorRenderProps,
	MenuItemLabel as ItemLabel,
	type MenuItemLabelCommonProps as DropdownMenuItemLabelCommonProps,
	type MenuItemLabelOptions as DropdownMenuItemLabelOptions,
	type MenuItemLabelProps as DropdownMenuItemLabelProps,
	type MenuItemLabelRenderProps as DropdownMenuItemLabelRenderProps,
	type MenuItemOptions as DropdownMenuItemOptions,
	type MenuItemProps as DropdownMenuItemProps,
	type MenuItemRenderProps as DropdownMenuItemRenderProps,
	MenuPortal as Portal,
	type MenuPortalProps as DropdownMenuPortalProps,
	MenuRadioGroup as RadioGroup,
	type MenuRadioGroupCommonProps as DropdownMenuRadioGroupCommonProps,
	type MenuRadioGroupOptions as DropdownMenuRadioGroupOptions,
	type MenuRadioGroupProps as DropdownMenuRadioGroupProps,
	type MenuRadioGroupRenderProps as DropdownMenuRadioGroupRenderProps,
	MenuRadioItem as RadioItem,
	type MenuRadioItemCommonProps as DropdownMenuRadioItemCommonProps,
	type MenuRadioItemOptions as DropdownMenuRadioItemOptions,
	type MenuRadioItemProps as DropdownMenuRadioItemProps,
	type MenuRadioItemRenderProps as DropdownMenuRadioItemPRenderrops,
	MenuSub as Sub,
	MenuSubContent as SubContent,
	type MenuSubContentCommonProps as DropdownMenuSubContentCommonProps,
	type MenuSubContentOptions as DropdownMenuSubContentOptions,
	type MenuSubContentProps as DropdownMenuSubContentProps,
	type MenuSubContentRenderProps as DropdownMenuSubContentRenderProps,
	type MenuSubOptions as DropdownMenuSubOptions,
	type MenuSubProps as DropdownMenuSubProps,
	MenuSubTrigger as SubTrigger,
	type MenuSubTriggerCommonProps as DropdownMenuSubTriggerCommonProps,
	type MenuSubTriggerOptions as DropdownMenuSubTriggerOptions,
	type MenuSubTriggerProps as DropdownMenuSubTriggerProps,
	type MenuSubTriggerRenderProps as DropdownMenuSubTriggerRenderProps,
	MenuTrigger as Trigger,
	type MenuTriggerCommonProps as DropdownMenuTriggerCommonProps,
	type MenuTriggerOptions as DropdownMenuTriggerOptions,
	type MenuTriggerProps as DropdownMenuTriggerProps,
	type MenuTriggerRenderProps as DropdownMenuTriggerRenderProps,
} from "../menu";
import {
	Arrow,
	type PopperArrowCommonProps as DropdownMenuArrowCommonProps,
	type PopperArrowOptions as DropdownMenuArrowOptions,
	type PopperArrowProps as DropdownMenuArrowProps,
	type PopperArrowRenderProps as DropdownMenuArrowRenderProps,
} from "../popper";
import {
	Root as Separator,
	type SeparatorRootCommonProps as DropdownMenuSeparatorCommonProps,
	type SeparatorRootOptions as DropdownMenuSeparatorOptions,
	type SeparatorRootProps as DropdownMenuSeparatorProps,
	type SeparatorRootRenderProps as DropdownMenuSeparatorRenderProps,
} from "../separator";
import {
	DropdownMenuContent as Content,
	type DropdownMenuContentCommonProps,
	type DropdownMenuContentOptions,
	type DropdownMenuContentProps,
	type DropdownMenuContentRenderProps,
} from "./dropdown-menu-content";
import {
	DropdownMenuRoot as Root,
	type DropdownMenuRootOptions,
	type DropdownMenuRootProps,
} from "./dropdown-menu-root";

export type {
	DropdownMenuArrowOptions,
	DropdownMenuArrowCommonProps,
	DropdownMenuArrowRenderProps,
	DropdownMenuArrowProps,
	DropdownMenuCheckboxItemOptions,
	DropdownMenuCheckboxItemCommonProps,
	DropdownMenuCheckboxItemRenderProps,
	DropdownMenuCheckboxItemProps,
	DropdownMenuContentOptions,
	DropdownMenuContentCommonProps,
	DropdownMenuContentRenderProps,
	DropdownMenuContentProps,
	DropdownMenuGroupLabelOptions,
	DropdownMenuGroupLabelCommonProps,
	DropdownMenuGroupLabelRenderProps,
	DropdownMenuGroupLabelProps,
	DropdownMenuGroupOptions,
	DropdownMenuGroupCommonProps,
	DropdownMenuGroupRenderProps,
	DropdownMenuGroupProps,
	DropdownMenuIconOptions,
	DropdownMenuIconCommonProps,
	DropdownMenuIconRenderProps,
	DropdownMenuIconProps,
	DropdownMenuItemDescriptionOptions,
	DropdownMenuItemDescriptionCommonProps,
	DropdownMenuItemDescriptionRenderProps,
	DropdownMenuItemDescriptionProps,
	DropdownMenuItemIndicatorOptions,
	DropdownMenuItemIndicatorCommonProps,
	DropdownMenuItemIndicatorRenderProps,
	DropdownMenuItemIndicatorProps,
	DropdownMenuItemLabelOptions,
	DropdownMenuItemLabelCommonProps,
	DropdownMenuItemLabelRenderProps,
	DropdownMenuItemLabelProps,
	DropdownMenuItemOptions,
	DropdownMenuItemCommonProps,
	DropdownMenuItemRenderProps,
	DropdownMenuItemProps,
	DropdownMenuPortalProps,
	DropdownMenuRadioGroupOptions,
	DropdownMenuRadioGroupCommonProps,
	DropdownMenuRadioGroupRenderProps,
	DropdownMenuRadioGroupProps,
	DropdownMenuRadioItemOptions,
	DropdownMenuRadioItemCommonProps,
	DropdownMenuRadioItemPRenderrops,
	DropdownMenuRadioItemProps,
	DropdownMenuRootOptions,
	DropdownMenuRootProps,
	DropdownMenuSeparatorOptions,
	DropdownMenuSeparatorCommonProps,
	DropdownMenuSeparatorRenderProps,
	DropdownMenuSeparatorProps,
	DropdownMenuSubContentOptions,
	DropdownMenuSubContentCommonProps,
	DropdownMenuSubContentRenderProps,
	DropdownMenuSubContentProps,
	DropdownMenuSubOptions,
	DropdownMenuSubProps,
	DropdownMenuSubTriggerOptions,
	DropdownMenuSubTriggerCommonProps,
	DropdownMenuSubTriggerRenderProps,
	DropdownMenuSubTriggerProps,
	DropdownMenuTriggerOptions,
	DropdownMenuTriggerCommonProps,
	DropdownMenuTriggerRenderProps,
	DropdownMenuTriggerProps,
};

export {
	Arrow,
	CheckboxItem,
	Content,
	Group,
	GroupLabel,
	Icon,
	Item,
	ItemDescription,
	ItemIndicator,
	ItemLabel,
	Portal,
	RadioGroup,
	RadioItem,
	Root,
	Separator,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
};

export const DropdownMenu = Object.assign(Root, {
	Arrow,
	CheckboxItem,
	Content,
	Group,
	GroupLabel,
	Icon,
	Item,
	ItemDescription,
	ItemIndicator,
	ItemLabel,
	Portal,
	RadioGroup,
	RadioItem,
	Separator,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
});
