import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useFormControlContext } from "./form-control-context";

/**
 * The field of the form control.
 */
export const FormControlField = createPolymorphicComponent<"input">(props => {
  const context = useFormControlContext();

  props = mergeDefaultProps(
    {
      as: "input",
      id: context.generateId("field"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id", "aria-labelledby", "aria-describedby"]);

  const ariaLabelledBy = () => {
    const hasAriaLabelledBy = local["aria-labelledby"] != null || context.labelId() != null;

    return (
      [
        local["aria-labelledby"],
        context.labelId(),
        // If there is both an aria-label and aria-labelledby, add the field itself has an aria-labelledby
        hasAriaLabelledBy && others["aria-label"] != null ? local.id : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  const ariaDescribedBy = () => {
    return (
      [
        context.descriptionId(),
        // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
        // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
        context.errorMessageId(),
        local["aria-describedby"],
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  createEffect(() => onCleanup(context.registerField(local.id!)));

  return (
    <Dynamic
      component={local.as}
      id={local.id}
      aria-labelledby={ariaLabelledBy()}
      aria-describedby={ariaDescribedBy()}
      {...context.dataset()}
      {...others}
    />
  );
});
