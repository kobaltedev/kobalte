import {
	MenuCheckboxItem as CheckboxItem,
	type MenuCheckboxItemCommonProps as NavigationMenuCheckboxItemCommonProps,
	type MenuCheckboxItemOptions as NavigationMenuCheckboxItemOptions,
	type MenuCheckboxItemProps as NavigationMenuCheckboxItemProps,
	type MenuCheckboxItemRenderProps as NavigationMenuCheckboxItemRenderProps,
	MenuGroup as Group,
	type MenuGroupCommonProps as NavigationMenuGroupCommonProps,
	MenuGroupLabel as GroupLabel,
	type MenuGroupLabelCommonProps as NavigationMenuGroupLabelCommonProps,
	type MenuGroupLabelOptions as NavigationMenuGroupLabelOptions,
	type MenuGroupLabelProps as NavigationMenuGroupLabelProps,
	type MenuGroupLabelRenderProps as NavigationMenuGroupLabelRenderProps,
	type MenuGroupOptions as NavigationMenuGroupOptions,
	type MenuGroupProps as NavigationMenuGroupProps,
	type MenuGroupRenderProps as NavigationMenuGroupRenderProps,
	MenuIcon as Icon,
	type MenuIconCommonProps as NavigationMenuIconCommonProps,
	type MenuIconOptions as NavigationMenuIconOptions,
	type MenuIconProps as NavigationMenuIconProps,
	type MenuIconRenderProps as NavigationMenuIconRenderProps,
	MenuItem as Item,
	type MenuItemCommonProps as NavigationMenuItemCommonProps,
	MenuItemDescription as ItemDescription,
	type MenuItemDescriptionCommonProps as NavigationMenuItemDescriptionCommonProps,
	type MenuItemDescriptionOptions as NavigationMenuItemDescriptionOptions,
	type MenuItemDescriptionProps as NavigationMenuItemDescriptionProps,
	type MenuItemDescriptionRenderProps as NavigationMenuItemDescriptionRenderProps,
	MenuItemIndicator as ItemIndicator,
	type MenuItemIndicatorCommonProps as NavigationMenuItemIndicatorCommonProps,
	type MenuItemIndicatorOptions as NavigationMenuItemIndicatorOptions,
	type MenuItemIndicatorProps as NavigationMenuItemIndicatorProps,
	type MenuItemIndicatorRenderProps as NavigationMenuItemIndicatorRenderProps,
	MenuItemLabel as ItemLabel,
	type MenuItemLabelCommonProps as NavigationMenuItemLabelCommonProps,
	type MenuItemLabelOptions as NavigationMenuItemLabelOptions,
	type MenuItemLabelProps as NavigationMenuItemLabelProps,
	type MenuItemLabelRenderProps as NavigationMenuItemLabelRenderProps,
	type MenuItemOptions as NavigationMenuItemOptions,
	type MenuItemProps as NavigationMenuItemProps,
	type MenuItemRenderProps as NavigationMenuItemRenderProps,
	MenuRadioGroup as RadioGroup,
	type MenuRadioGroupCommonProps as NavigationMenuRadioGroupCommonProps,
	type MenuRadioGroupOptions as NavigationMenuRadioGroupOptions,
	type MenuRadioGroupProps as NavigationMenuRadioGroupProps,
	type MenuRadioGroupRenderProps as NavigationMenuRadioGroupRenderProps,
	MenuRadioItem as RadioItem,
	type MenuRadioItemCommonProps as NavigationMenuRadioItemCommonProps,
	type MenuRadioItemOptions as NavigationMenuRadioItemOptions,
	type MenuRadioItemProps as NavigationMenuRadioItemProps,
	type MenuRadioItemRenderProps as NavigationMenuRadioItemPRenderrops,
	MenuSub as Sub,
	MenuSubContent as SubContent,
	type MenuSubContentCommonProps as NavigationMenuSubContentCommonProps,
	type MenuSubContentOptions as NavigationMenuSubContentOptions,
	type MenuSubContentProps as NavigationMenuSubContentProps,
	type MenuSubContentRenderProps as NavigationMenuSubContentRenderProps,
	type MenuSubOptions as NavigationMenuSubOptions,
	type MenuSubProps as NavigationMenuSubProps,
	MenuSubTrigger as SubTrigger,
	type MenuSubTriggerCommonProps as NavigationMenuSubTriggerCommonProps,
	type MenuSubTriggerOptions as NavigationMenuSubTriggerOptions,
	type MenuSubTriggerProps as NavigationMenuSubTriggerProps,
	type MenuSubTriggerRenderProps as NavigationMenuSubTriggerRenderProps,
} from "../menu";
import {
	Root as Separator,
	type SeparatorRootCommonProps as NavigationMenuSeparatorCommonProps,
	type SeparatorRootOptions as NavigationMenuSeparatorOptions,
	type SeparatorRootProps as NavigationMenuSeparatorProps,
	type SeparatorRootRenderProps as NavigationMenuSeparatorRenderProps,
} from "../separator";
import {
	NavigationMenuArrow as Arrow,
	type NavigationMenuArrowCommonProps,
	type NavigationMenuArrowOptions,
	type NavigationMenuArrowProps,
	type NavigationMenuArrowRenderProps,
} from "./navigation-menu-arrow";
import {
	NavigationMenuContent as Content,
	type NavigationMenuContentCommonProps,
	type NavigationMenuContentOptions,
	type NavigationMenuContentProps,
	type NavigationMenuContentRenderProps,
	type Motion,
} from "./navigation-menu-content";
import {
	NavigationMenuMenu as Menu,
	type NavigationMenuMenuOptions,
	type NavigationMenuMenuProps,
} from "./navigation-menu-menu";
import {
	NavigationMenuPortal as Portal,
	type NavigationMenuPortalProps,
} from "./navigation-menu-portal";
import {
	NavigationMenuRoot as Root,
	type NavigationMenuRootCommonProps,
	type NavigationMenuRootOptions,
	type NavigationMenuRootProps,
	type NavigationMenuRootRenderProps,
} from "./navigation-menu-root";
import {
	NavigationMenuTrigger as Trigger,
	type NavigationMenuTriggerCommonProps,
	type NavigationMenuTriggerOptions,
	type NavigationMenuTriggerProps,
	type NavigationMenuTriggerRenderProps,
} from "./navigation-menu-trigger";
import {
	NavigationMenuViewport as Viewport,
	type NavigationMenuViewportCommonProps,
	type NavigationMenuViewportOptions,
	type NavigationMenuViewportProps,
	type NavigationMenuViewportRenderProps,
} from "./navigation-menu-viewport";

export type {
	NavigationMenuRootOptions,
	NavigationMenuRootCommonProps,
	NavigationMenuRootRenderProps,
	NavigationMenuRootProps,
	NavigationMenuMenuOptions,
	NavigationMenuMenuProps,
	NavigationMenuArrowOptions,
	NavigationMenuArrowCommonProps,
	NavigationMenuArrowRenderProps,
	NavigationMenuArrowProps,
	NavigationMenuCheckboxItemOptions,
	NavigationMenuCheckboxItemCommonProps,
	NavigationMenuCheckboxItemRenderProps,
	NavigationMenuCheckboxItemProps,
	NavigationMenuContentOptions,
	NavigationMenuContentCommonProps,
	NavigationMenuContentRenderProps,
	NavigationMenuContentProps,
	NavigationMenuGroupLabelOptions,
	NavigationMenuGroupLabelCommonProps,
	NavigationMenuGroupLabelRenderProps,
	NavigationMenuGroupLabelProps,
	NavigationMenuGroupOptions,
	NavigationMenuGroupCommonProps,
	NavigationMenuGroupRenderProps,
	NavigationMenuGroupProps,
	NavigationMenuIconOptions,
	NavigationMenuIconCommonProps,
	NavigationMenuIconRenderProps,
	NavigationMenuIconProps,
	NavigationMenuItemDescriptionOptions,
	NavigationMenuItemDescriptionCommonProps,
	NavigationMenuItemDescriptionRenderProps,
	NavigationMenuItemDescriptionProps,
	NavigationMenuItemIndicatorOptions,
	NavigationMenuItemIndicatorCommonProps,
	NavigationMenuItemIndicatorRenderProps,
	NavigationMenuItemIndicatorProps,
	NavigationMenuItemLabelOptions,
	NavigationMenuItemLabelCommonProps,
	NavigationMenuItemLabelRenderProps,
	NavigationMenuItemLabelProps,
	NavigationMenuItemOptions,
	NavigationMenuItemCommonProps,
	NavigationMenuItemRenderProps,
	NavigationMenuItemProps,
	NavigationMenuPortalProps,
	NavigationMenuRadioGroupOptions,
	NavigationMenuRadioGroupCommonProps,
	NavigationMenuRadioGroupRenderProps,
	NavigationMenuRadioGroupProps,
	NavigationMenuRadioItemOptions,
	NavigationMenuRadioItemCommonProps,
	NavigationMenuRadioItemPRenderrops,
	NavigationMenuRadioItemProps,
	NavigationMenuSeparatorOptions,
	NavigationMenuSeparatorCommonProps,
	NavigationMenuSeparatorRenderProps,
	NavigationMenuSeparatorProps,
	NavigationMenuSubContentOptions,
	NavigationMenuSubContentCommonProps,
	NavigationMenuSubContentRenderProps,
	NavigationMenuSubContentProps,
	NavigationMenuSubOptions,
	NavigationMenuSubProps,
	NavigationMenuSubTriggerOptions,
	NavigationMenuSubTriggerCommonProps,
	NavigationMenuSubTriggerRenderProps,
	NavigationMenuSubTriggerProps,
	NavigationMenuTriggerOptions,
	NavigationMenuTriggerCommonProps,
	NavigationMenuTriggerRenderProps,
	NavigationMenuTriggerProps,
	NavigationMenuViewportOptions,
	NavigationMenuViewportCommonProps,
	NavigationMenuViewportRenderProps,
	NavigationMenuViewportProps,
	Motion,
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
	Menu,
	Separator,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
	Viewport,
};

export const NavigationMenu = Object.assign(Root, {
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
	Menu,
	Separator,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
	Viewport,
});