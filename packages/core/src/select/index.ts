import { Portal } from "solid-js/web";

import {
  FormControlDescription as Description,
  FormControlErrorMessage as ErrorMessage,
} from "../form-control";
import {
  type ListboxItemIndicatorOptions as SelectItemIndicatorOptions,
  type ListboxItemOptions as SelectItemOptions,
  Group,
  GroupLabel,
  Item,
  ItemDescription,
  ItemIndicator,
  ItemLabel,
} from "../listbox";
import { type PopperArrowOptions as SelectArrowOptions, PopperArrow as Arrow } from "../popper";
import {
  type SeparatorRootOptions as SelectSeparatorOptions,
  Root as Separator,
} from "../separator";
import { type SelectContentOptions, SelectContent as Content } from "./select-content";
import { SelectIcon as Icon } from "./select-icon";
import { SelectLabel as Label } from "./select-label";
import { type SelectListboxOptions, SelectListbox as Listbox } from "./select-listbox";
import { type SelectRootOptions, SelectRoot as Root } from "./select-root";
import { SelectTrigger as Trigger } from "./select-trigger";
import { type SelectValueOptions, SelectValue as Value } from "./select-value";

export type {
  SelectArrowOptions,
  SelectContentOptions,
  SelectItemIndicatorOptions,
  SelectItemOptions,
  SelectListboxOptions,
  SelectRootOptions,
  SelectSeparatorOptions,
  SelectValueOptions,
};

export {
  Arrow,
  Content,
  Description,
  ErrorMessage,
  Group,
  GroupLabel,
  Icon,
  Item,
  ItemDescription,
  ItemIndicator,
  ItemLabel,
  Label,
  Listbox,
  Portal,
  Root,
  Separator,
  Trigger,
  Value,
};
