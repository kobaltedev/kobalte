import { ComponentProps } from "solid-js";

import { FormControlLabel } from "../form-control";
import { As, Polymorphic } from "../polymorphic";

/**
 * The label that gives the user information on the radio group.
 */
export function RadioGroupLabel(props: ComponentProps<"span">) {
  return (
    <FormControlLabel>
      <As component={Polymorphic} fallback="span" {...props} />
    </FormControlLabel>
  );
}
