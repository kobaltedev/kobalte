import { FormControlDescription, FormControlDescriptionProps } from "../form-control/index.jsx";
import { useCheckboxContext } from "./checkbox-context.jsx";

export interface CheckboxDescriptionProps extends FormControlDescriptionProps {}

/**
 * The description that gives the user more information on the checkbox.
 */
export function CheckboxDescription(props: CheckboxDescriptionProps) {
  const context = useCheckboxContext();

  return <FormControlDescription {...context.dataset()} {...props} />;
}
