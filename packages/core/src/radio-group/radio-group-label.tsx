import { OverrideComponentProps } from "@kobalte/utils";

import { FormControlLabel } from "../form-control";
import { As, AsChildProp, Polymorphic } from "../polymorphic";

/**
 * The label that gives the user information on the radio group.
 */
export function RadioGroupLabel(props: OverrideComponentProps<"span", AsChildProp>) {
  return (
    <FormControlLabel asChild>
      <As component={Polymorphic} fallback="span" {...props} />
    </FormControlLabel>
  );
}
