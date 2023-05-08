import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";

export interface ListboxSectionProps extends OverrideComponentProps<"li", AsChildProp> {}

/**
 * A component used to render the label of a listbox option group.
 * It won't be focusable using arrow keys.
 */
export function ListboxSection(props: ListboxSectionProps) {
  return <Polymorphic as="li" role="presentation" {...props} />;
}
