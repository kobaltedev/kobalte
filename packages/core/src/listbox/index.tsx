import {
	ListboxItem as Item,
	type ListboxItemCommonProps,
	type ListboxItemOptions,
	type ListboxItemProps,
	type ListboxItemRenderProps,
} from "./listbox-item";
import {
	ListboxItemDescription as ItemDescription,
	type ListboxItemDescriptionCommonProps,
	type ListboxItemDescriptionOptions,
	type ListboxItemDescriptionProps,
	type ListboxItemDescriptionRenderProps,
} from "./listbox-item-description";
import {
	ListboxItemIndicator as ItemIndicator,
	type ListboxItemIndicatorCommonProps,
	type ListboxItemIndicatorOptions,
	type ListboxItemIndicatorProps,
	type ListboxItemIndicatorRenderProps,
} from "./listbox-item-indicator";
import {
	ListboxItemLabel as ItemLabel,
	type ListboxItemLabelCommonProps,
	type ListboxItemLabelOptions,
	type ListboxItemLabelProps,
	type ListboxItemLabelRenderProps,
} from "./listbox-item-label";
import {
	type ListboxRootCommonProps,
	type ListboxRootOptions,
	type ListboxRootProps,
	type ListboxRootRenderProps,
	ListboxRoot as Root,
} from "./listbox-root";
import {
	type ListboxSectionCommonProps,
	type ListboxSectionOptions,
	type ListboxSectionProps,
	type ListboxSectionRenderProps,
	ListboxSection as Section,
} from "./listbox-section";

export type {
	ListboxItemDescriptionOptions,
	ListboxItemDescriptionCommonProps,
	ListboxItemDescriptionRenderProps,
	ListboxItemDescriptionProps,
	ListboxItemIndicatorOptions,
	ListboxItemIndicatorCommonProps,
	ListboxItemIndicatorRenderProps,
	ListboxItemIndicatorProps,
	ListboxItemLabelOptions,
	ListboxItemLabelCommonProps,
	ListboxItemLabelRenderProps,
	ListboxItemLabelProps,
	ListboxItemOptions,
	ListboxItemCommonProps,
	ListboxItemRenderProps,
	ListboxItemProps,
	ListboxRootOptions,
	ListboxRootCommonProps,
	ListboxRootRenderProps,
	ListboxRootProps,
	ListboxSectionOptions,
	ListboxSectionCommonProps,
	ListboxSectionRenderProps,
	ListboxSectionProps,
};

export { Item, ItemDescription, ItemIndicator, ItemLabel, Root, Section };

export const Listbox = Object.assign(Root, {
	Item,
	ItemDescription,
	ItemIndicator,
	ItemLabel,
	Section,
});

/**
 * API will most probably change
 */
export { useListboxContext, type ListboxContextValue } from "./listbox-context";
