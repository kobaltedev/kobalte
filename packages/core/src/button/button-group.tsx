import { clsx } from "clsx";
import { ComponentProps, createContext, splitProps, useContext } from "solid-js";

import { bem, cva } from "../utils";
import { ButtonProps } from "./types";

interface ButtonGroupVariants {
  /** The orientation of the group. */
  orientation?: "horizontal" | "vertical";
}

type ButtonGroupContextValue = Pick<
  ButtonProps,
  "variant" | "size" | "isDestructive" | "isDisabled"
>;

export type ButtonGroupProps = ComponentProps<"div"> &
  ButtonGroupVariants &
  ButtonGroupContextValue;

const ButtonGroupContext = createContext<ButtonGroupContextValue>();

export function useButtonGroupContext() {
  return useContext(ButtonGroupContext);
}

const bemButtonGroup = bem("kb-button-group");

const buttonGroupStyles = cva<"root", ButtonGroupVariants>(
  {
    root: {
      base: bemButtonGroup.block(),
      variants: {
        orientation: {
          horizontal: bemButtonGroup.withModifier("horizontal"),
          vertical: bemButtonGroup.withModifier("vertical"),
        },
      },
    },
  },
  {
    orientation: "horizontal",
  }
);

export const ButtonGroup = (props: ButtonGroupProps) => {
  const [local, variantProps, contextValue, others] = splitProps(
    props,
    ["class"],
    ["orientation"],
    ["variant", "size", "isDestructive", "isDisabled"]
  );

  const classNames = buttonGroupStyles(variantProps);

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div role="group" class={clsx(classNames().root, local.class)} {...others} />
    </ButtonGroupContext.Provider>
  );
};
