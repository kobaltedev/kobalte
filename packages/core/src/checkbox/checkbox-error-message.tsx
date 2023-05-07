import { FormControlErrorMessage, FormControlErrorMessageProps } from "../form-control/index.jsx";
import { useCheckboxContext } from "./checkbox-context.jsx";

export interface CheckboxErrorMessageProps extends FormControlErrorMessageProps {}

/**
 * The error message that gives the user information about how to fix a validation error on the checkbox.
 */
export function CheckboxErrorMessage(props: CheckboxErrorMessageProps) {
  const context = useCheckboxContext();

  return <FormControlErrorMessage {...context.dataset()} {...props} />;
}
