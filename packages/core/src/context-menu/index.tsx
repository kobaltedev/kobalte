import {
	MenuCheckboxItem as CheckboxItem,
	type MenuCheckboxItemCommonProps as ContextMenuCheckboxItemCommonProps,
	type MenuCheckboxItemOptions as ContextMenuCheckboxItemOptions,
	type MenuCheckboxItemProps as ContextMenuCheckboxItemProps,
	type MenuCheckboxItemRenderProps as ContextMenuCheckboxItemRenderProps,
	type MenuGroupCommonProps as ContextMenuGroupCommonProps,
	type MenuGroupLabelCommonProps as ContextMenuGroupLabelCommonProps,
	type MenuGroupLabelOptions as ContextMenuGroupLabelOptions,
	type MenuGroupLabelProps as ContextMenuGroupLabelProps,
	type MenuGroupLabelRenderProps as ContextMenuGroupLabelRenderProps,
	type MenuGroupOptions as ContextMenuGroupOptions,
	type MenuGroupProps as ContextMenuGroupProps,
	type MenuGroupRenderProps as ContextMenuGroupRenderProps,
	type MenuIconCommonProps as ContextMenuIconCommonProps,
	type MenuIconOptions as ContextMenuIconOptions,
	type MenuIconProps as ContextMenuIconProps,
	type MenuIconRenderProps as ContextMenuIconRenderProps,
	type MenuItemCommonProps as ContextMenuItemCommonProps,
	type MenuItemDescriptionCommonProps as ContextMenuItemDescriptionCommonProps,
	type MenuItemDescriptionOptions as ContextMenuItemDescriptionOptions,
	type MenuItemDescriptionProps as ContextMenuItemDescriptionProps,
	type MenuItemDescriptionRenderProps as ContextMenuItemDescriptionRenderProps,
	type MenuItemIndicatorCommonProps as ContextMenuItemIndicatorCommonProps,
	type MenuItemIndicatorOptions as ContextMenuItemIndicatorOptions,
	type MenuItemIndicatorProps as ContextMenuItemIndicatorProps,
	type MenuItemIndicatorRenderProps as ContextMenuItemIndicatorRenderProps,
	type MenuItemLabelCommonProps as ContextMenuItemLabelCommonProps,
	type MenuItemLabelOptions as ContextMenuItemLabelOptions,
	type MenuItemLabelProps as ContextMenuItemLabelProps,
	type MenuItemLabelRenderProps as ContextMenuItemLabelRenderProps,
	type MenuItemOptions as ContextMenuItemOptions,
	type MenuItemProps as ContextMenuItemProps,
	type MenuItemRenderProps as ContextMenuItemRenderProps,
	type MenuPortalProps as ContextMenuPortalProps,
	type MenuRadioGroupCommonProps as ContextMenuRadioGroupCommonProps,
	type MenuRadioGroupOptions as ContextMenuRadioGroupOptions,
	type MenuRadioGroupProps as ContextMenuRadioGroupProps,
	type MenuRadioGroupRenderProps as ContextMenuRadioGroupRenderProps,
	type MenuRadioItemCommonProps as ContextMenuRadioItemCommonProps,
	type MenuRadioItemOptions as ContextMenuRadioItemOptions,
	type MenuRadioItemRenderProps as ContextMenuRadioItemPRenderrops,
	type MenuRadioItemProps as ContextMenuRadioItemProps,
	type MenuSubContentCommonProps as ContextMenuSubContentCommonProps,
	type MenuSubContentOptions as ContextMenuSubContentOptions,
	type MenuSubContentProps as ContextMenuSubContentProps,
	type MenuSubContentRenderProps as ContextMenuSubContentRenderProps,
	type MenuSubOptions as ContextMenuSubOptions,
	type MenuSubProps as ContextMenuSubProps,
	type MenuSubTriggerCommonProps as ContextMenuSubTriggerCommonProps,
	type MenuSubTriggerOptions as ContextMenuSubTriggerOptions,
	type MenuSubTriggerProps as ContextMenuSubTriggerProps,
	type MenuSubTriggerRenderProps as ContextMenuSubTriggerRenderProps,
	MenuGroup as Group,
	MenuGroupLabel as GroupLabel,
	MenuIcon as Icon,
	MenuItem as Item,
	MenuItemDescription as ItemDescription,
	MenuItemIndicator as ItemIndicator,
	MenuItemLabel as ItemLabel,
	MenuPortal as Portal,
	MenuRadioGroup as RadioGroup,
	MenuRadioItem as RadioItem,
	MenuSub as Sub,
	MenuSubContent as SubContent,
	MenuSubTrigger as SubTrigger,
} from "../menu";
import {
	Arrow,
	type PopperArrowCommonProps as ContextMenuArrowCommonProps,
	type PopperArrowOptions as ContextMenuArrowOptions,
	type PopperArrowProps as ContextMenuArrowProps,
	type PopperArrowRenderProps as ContextMenuArrowRenderProps,
} from "../popper";
import {
	type SeparatorRootCommonProps as ContextMenuSeparatorCommonProps,
	type SeparatorRootOptions as ContextMenuSeparatorOptions,
	type SeparatorRootProps as ContextMenuSeparatorProps,
	type SeparatorRootRenderProps as ContextMenuSeparatorRenderProps,
	Root as Separator,
} from "../separator";
import {
	ContextMenuContent as Content,
	type ContextMenuContentCommonProps,
	type ContextMenuContentOptions,
	type ContextMenuContentProps,
	type ContextMenuContentRenderProps,
} from "./context-menu-content";
import { useContextMenuContext } from "./context-menu-context";
import {
	type ContextMenuRootOptions,
	type ContextMenuRootProps,
	ContextMenuRoot as Root,
} from "./context-menu-root";
import {
	type ContextMenuTriggerCommonProps,
	type ContextMenuTriggerOptions,
	type ContextMenuTriggerProps,
	type ContextMenuTriggerRenderProps,
	ContextMenuTrigger as Trigger,
	useContextMenuTrigger,
} from "./context-menu-trigger";

export type {
	ContextMenuArrowOptions,
	ContextMenuArrowCommonProps,
	ContextMenuArrowRenderProps,
	ContextMenuArrowProps,
	ContextMenuCheckboxItemOptions,
	ContextMenuCheckboxItemCommonProps,
	ContextMenuCheckboxItemRenderProps,
	ContextMenuCheckboxItemProps,
	ContextMenuContentOptions,
	ContextMenuContentCommonProps,
	ContextMenuContentRenderProps,
	ContextMenuContentProps,
	ContextMenuGroupLabelOptions,
	ContextMenuGroupLabelCommonProps,
	ContextMenuGroupLabelRenderProps,
	ContextMenuGroupLabelProps,
	ContextMenuGroupOptions,
	ContextMenuGroupCommonProps,
	ContextMenuGroupRenderProps,
	ContextMenuGroupProps,
	ContextMenuIconOptions,
	ContextMenuIconCommonProps,
	ContextMenuIconRenderProps,
	ContextMenuIconProps,
	ContextMenuItemDescriptionOptions,
	ContextMenuItemDescriptionCommonProps,
	ContextMenuItemDescriptionRenderProps,
	ContextMenuItemDescriptionProps,
	ContextMenuItemIndicatorOptions,
	ContextMenuItemIndicatorCommonProps,
	ContextMenuItemIndicatorRenderProps,
	ContextMenuItemIndicatorProps,
	ContextMenuItemLabelOptions,
	ContextMenuItemLabelCommonProps,
	ContextMenuItemLabelRenderProps,
	ContextMenuItemLabelProps,
	ContextMenuItemOptions,
	ContextMenuItemCommonProps,
	ContextMenuItemRenderProps,
	ContextMenuItemProps,
	ContextMenuPortalProps,
	ContextMenuRadioGroupOptions,
	ContextMenuRadioGroupCommonProps,
	ContextMenuRadioGroupRenderProps,
	ContextMenuRadioGroupProps,
	ContextMenuRadioItemOptions,
	ContextMenuRadioItemCommonProps,
	ContextMenuRadioItemPRenderrops,
	ContextMenuRadioItemProps,
	ContextMenuRootOptions,
	ContextMenuRootProps,
	ContextMenuSeparatorOptions,
	ContextMenuSeparatorCommonProps,
	ContextMenuSeparatorRenderProps,
	ContextMenuSeparatorProps,
	ContextMenuSubContentOptions,
	ContextMenuSubContentCommonProps,
	ContextMenuSubContentRenderProps,
	ContextMenuSubContentProps,
	ContextMenuSubOptions,
	ContextMenuSubProps,
	ContextMenuSubTriggerOptions,
	ContextMenuSubTriggerCommonProps,
	ContextMenuSubTriggerRenderProps,
	ContextMenuSubTriggerProps,
	ContextMenuTriggerOptions,
	ContextMenuTriggerCommonProps,
	ContextMenuTriggerRenderProps,
	ContextMenuTriggerProps,
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

export const ContextMenu = Object.assign(Root, {
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
	useContextMenuTrigger,
});
