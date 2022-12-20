import { createPolymorphicComponent } from "@kobalte/utils";

import { FormControlLabel } from "../form-control";

/**
 * The label that gives the user information on the radio group.
 */
export const RadioGroupLabel = createPolymorphicComponent<"span">(props => {
  return <FormControlLabel as="span" {...props} />;
});
