import { FormControlDescription, FormControlDescriptionProps } from "../form-control";
import { useCheckboxContext } from "./checkbox-context";

export interface CheckboxDescriptionProps extends FormControlDescriptionProps {}

/**
 * The description that gives the user more information on the checkbox.
 */
export function CheckboxDescription(props: CheckboxDescriptionProps) {
  const context = useCheckboxContext();

  return <FormControlDescription {...context.dataset()} {...props} />;
}
