/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useCheckbox.ts
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/toggle/src/useToggle.ts
 */

import { callHandler, combineProps, mergeDefaultProps, visuallyHiddenStyles } from "@kobalte/utils";
import { ComponentProps, createEffect, JSX, on, splitProps } from "solid-js";

import { createFocusRing, createPress } from "../primitives";
import { useCheckboxContext } from "./checkbox-context";

/**
 * The native html input that is visually hidden in the checkbox.
 */
export function CheckboxInput(props: ComponentProps<"input">) {
  let ref: HTMLInputElement | undefined;

  const context = useCheckboxContext();

  props = mergeDefaultProps({ id: context.generateId("input") }, props);

  const [local, others] = splitProps(props, ["onChange"]);

  const { pressHandlers } = createPress({
    isDisabled: context.isDisabled,
  });

  const { focusRingHandlers } = createFocusRing({
    onFocusChange: value => context.setIsFocused(value),
    onFocusVisibleChange: value => context.setIsFocusVisible(value),
  });

  const ariaLabelledBy = () => {
    return (
      [
        context.ariaLabelledBy(),
        // If there is both an aria-label and aria-labelledby, add the input itself has an aria-labelledby
        context.ariaLabelledBy() != null && context.ariaLabel() != null ? others.id : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = e => {
    callHandler(e, local.onChange);

    e.stopPropagation();

    const target = e.target as HTMLInputElement;

    context.setIsChecked(target.checked);

    // Unlike in React, inputs `checked` state can be out of sync with our toggle state.
    // for example a readonly `<input type="checkbox" />` is always "checkable".
    //
    // Also, even if an input is controlled (ex: `<input type="checkbox" checked={isChecked} />`,
    // clicking on the input will change its internal `checked` state.
    //
    // To prevent this, we need to force the input `checked` state to be in sync with the toggle state.
    target.checked = context.isChecked();
  };

  // indeterminate is a property, but it can only be set via javascript
  // https://css-tricks.com/indeterminate-checkboxes/
  // Unlike in React, inputs `indeterminate` state can be out of sync with our.
  // Clicking on the input will change its internal `indeterminate` state.
  // To prevent this, we need to force the input `indeterminate` state to be in sync with our.
  createEffect(
    on([() => ref, () => context.isChecked()], ([ref]) => {
      if (ref) {
        ref.indeterminate = context.isIndeterminate() || false;
      }
    })
  );

  return (
    <input
      type="checkbox"
      name={context.name()}
      value={context.value()}
      checked={context.isChecked()}
      required={context.isRequired()}
      disabled={context.isDisabled()}
      readonly={context.isReadOnly()}
      aria-label={context.ariaLabel()}
      aria-labelledby={ariaLabelledBy()}
      aria-describedby={context.ariaDescribedBy()}
      aria-errormessage={context.ariaErrorMessage()}
      aria-invalid={context.validationState() === "invalid" || undefined}
      aria-required={context.isRequired() || undefined}
      aria-disabled={context.isDisabled() || undefined}
      aria-readonly={context.isReadOnly() || undefined}
      onChange={onChange}
      {...context.dataset()}
      {...combineProps(
        { ref: el => (ref = el), style: visuallyHiddenStyles },
        others,
        pressHandlers,
        focusRingHandlers
      )}
    />
  );
}
