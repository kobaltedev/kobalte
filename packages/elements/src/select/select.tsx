import { createMemo, ParentComponent, splitProps } from "solid-js";

import { CollectionKey, createControllableSignal } from "../primitives";
import { SelectBase, SelectBaseComposite, SelectBaseProps } from "./select-base";

export interface SelectProps
  extends Omit<SelectBaseProps, "value" | "defaultValue" | "onValueChange" | "isMultiple"> {
  /** The controlled value of the select. */
  value?: CollectionKey;

  /**
   * The value of the select when initially rendered.
   * Useful when you do not need to control the state.
   */
  defaultValue?: CollectionKey;

  /** Event handler called when the value changes. */
  onValueChange?: (value: CollectionKey) => void;
}

export const Select: ParentComponent<SelectProps> & SelectBaseComposite = props => {
  const [local, others] = splitProps(props, ["value", "defaultValue", "onValueChange"]);

  const [singleValue, setSingleValue] = createControllableSignal<CollectionKey>({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: value => local.onValueChange?.(value),
  });

  const value = createMemo(() => {
    const val = singleValue();
    return val == null ? undefined : [val];
  });

  const onValueChange = (keys: Set<CollectionKey>) => {
    setSingleValue(keys.values().next().value);
  };

  return (
    <SelectBase
      value={value()}
      onValueChange={onValueChange}
      isMultiple={false}
      disallowEmptySelection
      {...others}
    />
  );
};

Select.Label = SelectBase.Label;
Select.Description = SelectBase.Description;
Select.ErrorMessage = SelectBase.ErrorMessage;
Select.Trigger = SelectBase.Trigger;
Select.Value = SelectBase.Value;
Select.Icon = SelectBase.Icon;
Select.Portal = SelectBase.Portal;
Select.Menu = SelectBase.Menu;
Select.Positioner = SelectBase.Positioner;
Select.Separator = SelectBase.Separator;
Select.Group = SelectBase.Group;
Select.GroupLabel = SelectBase.GroupLabel;
Select.GroupOptions = SelectBase.GroupOptions;
Select.Option = SelectBase.Option;
Select.OptionLabel = SelectBase.OptionLabel;
Select.OptionDescription = SelectBase.OptionDescription;
Select.OptionIndicator = SelectBase.OptionIndicator;
