import {
  FormControlDescription as Description,
  type FormControlDescriptionProps as ComboboxDescriptionProps,
  FormControlErrorMessage as ErrorMessage,
  type FormControlErrorMessageOptions as ComboboxErrorMessageOptions,
  type FormControlErrorMessageProps as ComboboxErrorMessageProps,
  FormControlLabel as Label,
  type FormControlLabelProps as ComboboxLabelProps,
} from "../form-control";
import {
  Item,
  ItemDescription,
  ItemIndicator,
  ItemLabel,
  type ListboxItemDescriptionProps as ComboboxItemDescriptionProps,
  type ListboxItemIndicatorOptions as ComboboxItemIndicatorOptions,
  type ListboxItemIndicatorProps as ComboboxItemIndicatorProps,
  type ListboxItemLabelProps as ComboboxItemLabelProps,
  type ListboxItemOptions as ComboboxItemOptions,
  type ListboxItemProps as ComboboxItemProps,
  type ListboxSectionProps as ComboboxSectionProps,
  Section,
} from "../listbox";
import {
  PopperArrow as Arrow,
  type PopperArrowOptions as ComboboxArrowOptions,
  type PopperArrowProps as ComboboxArrowProps,
} from "../popper";
import { ComboboxButton as Button, type ComboboxButtonProps } from "./combobox-button";
import {
  ComboboxContent as Content,
  type ComboboxContentOptions,
  type ComboboxContentProps,
} from "./combobox-content";
import { ComboboxInput as Input, type ComboboxInputProps } from "./combobox-input";
import {
  ComboboxListbox as Listbox,
  type ComboboxListboxOptions,
  type ComboboxListboxProps,
} from "./combobox-listbox";
import { ComboboxPortal as Portal, type ComboboxPortalProps } from "./combobox-portal";
import {
  type ComboboxItemComponentProps,
  ComboboxRoot as Root,
  type ComboboxRootOptions,
  type ComboboxRootProps,
  type ComboboxSectionComponentProps,
  type ComboboxValueComponentProps,
} from "./combobox-root";
import { ComboboxTrigger as Trigger, type ComboboxTriggerProps } from "./combobox-trigger";
import { ComboboxValue as Value, type ComboboxValueProps } from "./combobox-value";

export type {
  ComboboxArrowOptions,
  ComboboxArrowProps,
  ComboboxButtonProps,
  ComboboxContentOptions,
  ComboboxContentProps,
  ComboboxDescriptionProps,
  ComboboxErrorMessageOptions,
  ComboboxErrorMessageProps,
  ComboboxInputProps,
  ComboboxItemComponentProps,
  ComboboxItemDescriptionProps,
  ComboboxItemIndicatorOptions,
  ComboboxItemIndicatorProps,
  ComboboxItemLabelProps,
  ComboboxItemOptions,
  ComboboxItemProps,
  ComboboxLabelProps,
  ComboboxListboxOptions,
  ComboboxListboxProps,
  ComboboxPortalProps,
  ComboboxRootOptions,
  ComboboxRootProps,
  ComboboxSectionComponentProps,
  ComboboxSectionProps,
  ComboboxTriggerProps,
  ComboboxValueComponentProps,
  ComboboxValueProps,
};

export {
  Arrow,
  Button,
  Content,
  Description,
  ErrorMessage,
  Input,
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
