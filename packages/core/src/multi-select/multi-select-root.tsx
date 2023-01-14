import { ParentProps } from "solid-js";

import { SelectBase, SelectBaseOptions } from "../select/select-base";

export interface MultiSelectRootOptions extends Omit<SelectBaseOptions, "selectionMode"> {}

/**
 * Displays a list of options for the user to pick multiples from — triggered by a button.
 */
export function MultiSelectRoot(props: ParentProps<MultiSelectRootOptions>) {
  return <SelectBase selectionMode="multiple" disallowEmptySelection={false} {...props} />;
}
