import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";

/**
 * A component used to render the label of a listbox option group.
 * It won't be focusable using arrow keys.
 */
export function ListboxSection(props: ComponentProps<"li">) {
  return <Polymorphic fallback="li" role="presentation" {...props} />;
}
