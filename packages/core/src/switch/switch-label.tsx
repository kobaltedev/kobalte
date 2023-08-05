import { FormControlLabel, FormControlLabelProps } from "../form-control";
import { useSwitchContext } from "./switch-context";

export interface SwitchLabelProps extends FormControlLabelProps {}

/**
 * The label that gives the user information on the switch.
 */
export function SwitchLabel(props: SwitchLabelProps) {
  const context = useSwitchContext();

  return <FormControlLabel {...context.dataset()} {...props} />;
}
