import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";

/**
 * A component used to render the label of a listbox option group.
 * It won't be focusable using arrow keys.
 */
export function ListboxSection(props: OverrideComponentProps<"li", AsChildProp>) {
  return <Polymorphic fallback="li" role="presentation" {...props} />;
}
