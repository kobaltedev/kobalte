import { FormControlLabel, FormControlLabelProps } from "../form-control/index.js";
import { useSwitchContext } from "./switch-context.js";

export interface SwitchLabelProps extends FormControlLabelProps {}

/**
 * The label that gives the user information on the switch.
 */
export function SwitchLabel(props: SwitchLabelProps) {
  const context = useSwitchContext();

  return <FormControlLabel {...context.dataset()} {...props} />;
}
