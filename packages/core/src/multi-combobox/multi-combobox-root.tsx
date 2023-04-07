import { OverrideComponentProps } from "@kobalte/utils";

import {
  ComboboxBase,
  ComboboxBaseItemComponentProps,
  ComboboxBaseOptions,
  ComboboxBaseSectionComponentProps,
} from "../combobox/combobox-base";
import { AsChildProp } from "../polymorphic";

export interface MultiComboboxRootItemComponentProps<T> extends ComboboxBaseItemComponentProps<T> {}
export interface MultiComboboxRootSectionComponentProps<T>
  extends ComboboxBaseSectionComponentProps<T> {}

export interface MultiComboboxRootOptions<Option, OptGroup = never>
  extends Omit<ComboboxBaseOptions<Option, OptGroup>, "displayValue"> {}

export interface MultiComboboxRootProps<Option, OptGroup = never>
  extends OverrideComponentProps<"div", MultiComboboxRootOptions<Option, OptGroup>>,
    AsChildProp {}

/**
 *  An input widget with an associated popup that enables users to select some values from a collection of possible values.
 */
export function MultiComboboxRoot<Option, OptGroup = never>(
  props: MultiComboboxRootProps<Option, OptGroup>
) {
  return <ComboboxBase selectionMode="multiple" disallowEmptySelection={false} {...props} />;
}
