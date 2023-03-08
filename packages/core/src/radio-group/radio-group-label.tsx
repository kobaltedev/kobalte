import { OverrideComponentProps } from "@kobalte/utils";

import { FormControlLabel } from "../form-control";
import { As, AsChildProp, Polymorphic } from "../polymorphic";

export interface RadioGroupLabelProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * The label that gives the user information on the radio group.
 */
export function RadioGroupLabel(props: RadioGroupLabelProps) {
  return (
    <FormControlLabel asChild>
      <As component={Polymorphic} fallback="span" {...props} />
    </FormControlLabel>
  );
}
