import { FormControlLabel, FormControlLabelProps } from "../form-control/index.jsx";
import { useCheckboxContext } from "./checkbox-context.jsx";

export interface CheckboxLabelProps extends FormControlLabelProps {}

/**
 * The label that gives the user information on the checkbox.
 */
export function CheckboxLabel(props: CheckboxLabelProps) {
  const context = useCheckboxContext();

  return <FormControlLabel {...context.dataset()} {...props} />;
}
