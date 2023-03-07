import { SelectBase, SelectBaseOptions } from "../select/select-base";

export interface MultiSelectRootOptions<Option, OptGroup = never>
  extends Omit<SelectBaseOptions<Option, OptGroup>, "selectionMode"> {}

/**
 * Displays a list of options for the user to pick multiples from — triggered by a button.
 */
export function MultiSelectRoot<Option, OptGroup = never>(
  props: MultiSelectRootOptions<Option, OptGroup>
) {
  return <SelectBase selectionMode="multiple" disallowEmptySelection={false} {...props} />;
}
