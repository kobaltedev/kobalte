import { FormControlDescription, FormControlDescriptionProps } from "../form-control";
import { useSwitchContext } from "./switch-context";

export interface SwitchDescriptionProps extends FormControlDescriptionProps {}

/**
 * The description that gives the user more information on the switch.
 */
export function SwitchDescription(props: SwitchDescriptionProps) {
  const context = useSwitchContext();

  return <FormControlDescription {...context.dataset()} {...props} />;
}
