import {
  FormControlDescription as Description,
  type FormControlDescriptionProps as SelectDescriptionProps,
  FormControlErrorMessage as ErrorMessage,
  type FormControlErrorMessageOptions as SelectErrorMessageOptions,
  type FormControlErrorMessageProps as SelectErrorMessageProps,
} from "../form-control";
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
} from "../listbox";
import {
  PopperArrow as Arrow,
  type PopperArrowOptions as SelectArrowOptions,
  type PopperArrowProps as SelectArrowProps,
} from "../popper";
import {
  HiddenSelect as HiddenSelect,
  type HiddenSelectProps as SelectHiddenSelectProps,
} from "./hidden-select";
import {
  SelectContent as Content,
  type SelectContentOptions,
  type SelectContentProps,
} from "./select-content";
import { SelectIcon as Icon, type SelectIconProps } from "./select-icon";
import { SelectLabel as Label, type SelectLabelProps } from "./select-label";
import {
  SelectListbox as Listbox,
  type SelectListboxOptions,
  type SelectListboxProps,
} from "./select-listbox";
import { SelectPortal as Portal, type SelectPortalProps } from "./select-portal";
import {
  type SelectItemComponentProps,
  SelectRoot as Root,
  type SelectRootOptions,
  type SelectRootProps,
  type SelectSectionComponentProps,
  type SelectValueComponentProps,
} from "./select-root";
import { SelectTrigger as Trigger, type SelectTriggerProps } from "./select-trigger";
import { SelectValue as Value, type SelectValueProps } from "./select-value";

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
  SelectItemComponentProps,
  SelectItemDescriptionProps,
  SelectItemIndicatorOptions,
  SelectItemIndicatorProps,
  SelectItemLabelProps,
  SelectItemOptions,
  SelectItemProps,
  SelectLabelProps,
  SelectListboxOptions,
  SelectListboxProps,
  SelectPortalProps,
  SelectRootOptions,
  SelectRootProps,
  SelectSectionComponentProps,
  SelectSectionProps,
  SelectTriggerProps,
  SelectValueComponentProps,
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