import {
  FormControlDescription as Description,
  type FormControlDescriptionProps as SelectDescriptionProps,
  FormControlErrorMessage as ErrorMessage,
  type FormControlErrorMessageOptions as SelectErrorMessageOptions,
  type FormControlErrorMessageProps as SelectErrorMessageProps,
} from "../form-control/index.jsx";
import {
  Item,
  ItemDescription,
  ItemIndicator,
  ItemLabel,
  type ListboxItemDescriptionProps as SelectItemDescriptionProps,
  type ListboxItemIndicatorOptions as SelectItemIndicatorOptions,
  type ListboxItemIndicatorProps as SelectItemIndicatorProps,
  type ListboxItemLabelProps as SelectItemLabelProps,
  type ListboxItemOptions as SelectItemOptions,
  type ListboxItemProps as SelectItemProps,
  type ListboxSectionProps as SelectSectionProps,
  Section,
} from "../listbox/index.jsx";
import {
  PopperArrow as Arrow,
  type PopperArrowOptions as SelectArrowOptions,
  type PopperArrowProps as SelectArrowProps,
} from "../popper/index.jsx";
import {
  type SelectBaseItemComponentProps as SelectRootItemComponentProps,
  type SelectBaseSectionComponentProps as SelectRootSectionComponentProps,
} from "./select-base.jsx";
import {
  SelectContent as Content,
  type SelectContentOptions,
  type SelectContentProps,
} from "./select-content.jsx";
import {
  SelectHiddenSelect as HiddenSelect,
  type SelectHiddenSelectProps,
} from "./select-hidden-select.jsx";
import { SelectIcon as Icon, type SelectIconProps } from "./select-icon.jsx";
import { SelectLabel as Label, type SelectLabelProps } from "./select-label.jsx";
import {
  SelectListbox as Listbox,
  type SelectListboxOptions,
  type SelectListboxProps,
} from "./select-listbox.jsx";
import { SelectPortal as Portal, type SelectPortalProps } from "./select-portal.jsx";
import {
  type SelectMultipleSelectionOptions,
  SelectRoot as Root,
  type SelectRootOptions,
  type SelectRootProps,
  type SelectSingleSelectionOptions,
} from "./select-root.jsx";
import { SelectTrigger as Trigger, type SelectTriggerProps } from "./select-trigger.jsx";
import { SelectValue as Value, type SelectValueProps } from "./select-value.jsx";

export type {
  SelectArrowOptions,
  SelectArrowProps,
  SelectContentOptions,
  SelectContentProps,
  SelectDescriptionProps,
  SelectErrorMessageOptions,
  SelectErrorMessageProps,
  SelectHiddenSelectProps,
  SelectIconProps,
  SelectItemDescriptionProps,
  SelectItemIndicatorOptions,
  SelectItemIndicatorProps,
  SelectItemLabelProps,
  SelectItemOptions,
  SelectItemProps,
  SelectLabelProps,
  SelectListboxOptions,
  SelectListboxProps,
  SelectMultipleSelectionOptions,
  SelectPortalProps,
  SelectRootItemComponentProps,
  SelectRootOptions,
  SelectRootProps,
  SelectRootSectionComponentProps,
  SelectSectionProps,
  SelectSingleSelectionOptions,
  SelectTriggerProps,
  SelectValueProps,
};

export {
  Arrow,
  Content,
  Description,
  ErrorMessage,
  HiddenSelect,
  Icon,
  Item,
  ItemDescription,
  ItemIndicator,
  ItemLabel,
  Label,
  Listbox,
  Portal,
  Root,
  Section,
  Trigger,
  Value,
};
