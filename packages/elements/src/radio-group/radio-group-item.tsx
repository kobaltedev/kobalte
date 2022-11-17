import { chainHandlers, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createFocusRing } from "../primitives";
import { RadioGroupItemContext, RadioGroupItemContextValue } from "./radio-group-item-context";

/**
 * The root container for a radio group's item.
 */
export const RadioGroupItem = createPolymorphicComponent<"label">(props => {
  props = mergeDefaultProps({ as: "label" }, props);

  const [local, others] = splitProps(props, ["as", "children", "onFocusIn", "onFocusOut"]);

  const { isFocused, isFocusVisible, focusHandlers } = createFocusRing({
    within: true,
  });

  const onFocusIn: JSX.EventHandlerUnion<HTMLLabelElement, FocusEvent> = e => {
    chainHandlers(e, [local.onFocusIn, focusHandlers.onFocusIn]);
  };

  const onFocusOut: JSX.EventHandlerUnion<HTMLLabelElement, FocusEvent> = e => {
    chainHandlers(e, [local.onFocusOut, focusHandlers.onFocusOut]);
  };

  const context: RadioGroupItemContextValue = {
    isFocused,
    isFocusVisible,
  };

  return (
    <Dynamic
      component={local.as}
      data-part="item"
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      onFocusIn={onFocusIn}
      onFocusOut={onFocusOut}
      {...others}
    >
      <RadioGroupItemContext.Provider value={context}>
        {local.children}
      </RadioGroupItemContext.Provider>
    </Dynamic>
  );
});
