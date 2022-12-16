import { ParentComponent } from "solid-js";

import { SelectBase, SelectBaseComposite, SelectBaseProps } from "./select-base";

export interface MultiSelectSelectProps extends Omit<SelectBaseProps, "isMultiple"> {}

export const MultiSelect: ParentComponent<MultiSelectSelectProps> & SelectBaseComposite = props => {
  return <SelectBase isMultiple disallowEmptySelection={false} {...props} />;
};

MultiSelect.Label = SelectBase.Label;
MultiSelect.Description = SelectBase.Description;
MultiSelect.ErrorMessage = SelectBase.ErrorMessage;
MultiSelect.Trigger = SelectBase.Trigger;
MultiSelect.Value = SelectBase.Value;
MultiSelect.Icon = SelectBase.Icon;
MultiSelect.Portal = SelectBase.Portal;
MultiSelect.Menu = SelectBase.Menu;
MultiSelect.Positioner = SelectBase.Positioner;
MultiSelect.Separator = SelectBase.Separator;
MultiSelect.Group = SelectBase.Group;
MultiSelect.GroupLabel = SelectBase.GroupLabel;
MultiSelect.GroupOptions = SelectBase.GroupOptions;
MultiSelect.Option = SelectBase.Option;
MultiSelect.OptionLabel = SelectBase.OptionLabel;
MultiSelect.OptionDescription = SelectBase.OptionDescription;
MultiSelect.OptionIndicator = SelectBase.OptionIndicator;
