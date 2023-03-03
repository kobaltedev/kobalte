import { ParentProps } from "solid-js";

import { SelectBase, SelectBaseOptions } from "../select/select-base";

export interface MultiSelectRootOptions<T> extends Omit<SelectBaseOptions<T>, "selectionMode"> {}

/**
 * Displays a list of options for the user to pick multiples from — triggered by a button.
 */
export function MultiSelectRoot<T>(props: ParentProps<MultiSelectRootOptions<T>>) {
  return <SelectBase selectionMode="multiple" disallowEmptySelection={false} {...props} />;
}
