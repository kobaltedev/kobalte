import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic/index.js";

export interface ListboxSectionProps extends OverrideComponentProps<"li", AsChildProp> {}

/**
 * A component used to render the label of a listbox option group.
 * It won't be focusable using arrow keys.
 */
export function ListboxSection(props: ListboxSectionProps) {
  return <Polymorphic as="li" role="presentation" {...props} />;
}
