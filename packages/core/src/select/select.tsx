import { ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";

import { FormControlDescription, FormControlErrorMessage } from "../form-control";
import { Listbox } from "../listbox";
import { Popper } from "../popper";
import { Separator } from "../separator";
import { SelectContent } from "./select-content";
import { SelectIcon } from "./select-icon";
import { SelectLabel } from "./select-label";
import { SelectListbox } from "./select-listbox";
import { SelectMulti } from "./select-multi";
import { SelectSingle, SelectSingleOptions } from "./select-single";
import { SelectTrigger } from "./select-trigger";
import { SelectValue } from "./select-value";

type SelectComposite = {
  Multi: typeof SelectMulti;
  Label: typeof SelectLabel;
  Description: typeof FormControlDescription;
  ErrorMessage: typeof FormControlErrorMessage;
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Icon: typeof SelectIcon;
  Portal: typeof Portal;
  Content: typeof SelectContent;
  Arrow: typeof Popper.Arrow;
  Listbox: typeof SelectListbox;
  Separator: typeof Separator;
  Group: typeof Listbox.Group;
  GroupLabel: typeof Listbox.GroupLabel;
  Item: typeof Listbox.Item;
  ItemLabel: typeof Listbox.ItemLabel;
  ItemDescription: typeof Listbox.ItemDescription;
  ItemIndicator: typeof Listbox.ItemIndicator;
};

/**
 * Displays a list of options for the user to pick from — triggered by a button.
 */
export const Select: ParentComponent<SelectSingleOptions> & SelectComposite = props => {
  return <SelectSingle {...props} />;
};

Select.Multi = SelectMulti;
Select.Label = SelectLabel;
Select.Description = FormControlDescription;
Select.ErrorMessage = FormControlErrorMessage;
Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Icon = SelectIcon;
Select.Portal = Portal;
Select.Content = SelectContent;
Select.Arrow = Popper.Arrow;
Select.Listbox = SelectListbox;
Select.Separator = Separator;
Select.Group = Listbox.Group;
Select.GroupLabel = Listbox.GroupLabel;
Select.Item = Listbox.Item;
Select.ItemLabel = Listbox.ItemLabel;
Select.ItemDescription = Listbox.ItemDescription;
Select.ItemIndicator = Listbox.ItemIndicator;
