import { FormControlErrorMessage, FormControlErrorMessageProps } from "../form-control/index.jsx";
import { useSwitchContext } from "./switch-context.jsx";

export interface SwitchErrorMessageProps extends FormControlErrorMessageProps {}

/**
 * The error message that gives the user information about how to fix a validation error on the switch.
 */
export function SwitchErrorMessage(props: SwitchErrorMessageProps) {
  const context = useSwitchContext();

  return <FormControlErrorMessage {...context.dataset()} {...props} />;
}
