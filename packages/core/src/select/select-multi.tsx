import { ParentProps } from "solid-js";

import { SelectRoot, SelectRootOptions } from "./select-root";

export interface SelectMultiOptions extends Omit<SelectRootOptions, "selectionMode"> {}

/**
 * Displays a list of options for the user to pick multiples from — triggered by a button.
 */
export function SelectMulti(props: ParentProps<SelectMultiOptions>) {
  return <SelectRoot selectionMode="multiple" disallowEmptySelection={false} {...props} />;
}
