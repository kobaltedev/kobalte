import { clsx } from "clsx";
import { splitProps } from "solid-js";

import { buttonGroupStyles } from "./button-group.styles";
import { ButtonGroupContext } from "./button-group-context";
import { ButtonGroupProps } from "./types";

export const ButtonGroup = (props: ButtonGroupProps) => {
  const [local, variantProps, contextValue, others] = splitProps(
    props,
    ["class"],
    ["orientation"],
    ["color", "variant", "size", "isDisabled"]
  );

  const classNames = buttonGroupStyles(variantProps);

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div role="group" class={clsx(classNames().root, local.class)} {...others} />
    </ButtonGroupContext.Provider>
  );
};
