import {
  FormControlDescription as Description,
  FormControlErrorMessage as ErrorMessage,
} from "../form-control";
import {
  Item,
  ItemDescription,
  ItemIndicator,
  ItemLabel,
  type ListboxItemIndicatorOptions as SelectItemIndicatorOptions,
  type ListboxItemOptions as SelectItemOptions,
  Section,
} from "../listbox";
import { PopperArrow as Arrow, type PopperArrowOptions as SelectArrowOptions } from "../popper";
import { HiddenSelect as HiddenSelect } from "./hidden-select";
import { SelectContent as Content, type SelectContentOptions } from "./select-content";
import { SelectIcon as Icon } from "./select-icon";
import { SelectLabel as Label } from "./select-label";
import {
  SelectListbox as Listbox,
  type SelectListboxOptions,
  type SelectListboxProps,
} from "./select-listbox";
import { SelectPortal as Portal } from "./select-portal";
import { SelectRoot as Root, type SelectRootOptions } from "./select-root";
import { SelectTrigger as Trigger } from "./select-trigger";
import { SelectValue as Value } from "./select-value";

export type {
  SelectArrowOptions,
  SelectContentOptions,
  SelectItemIndicatorOptions,
  SelectItemOptions,
  SelectListboxOptions,
  SelectListboxProps,
  SelectRootOptions,
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
