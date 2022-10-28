import { hope } from "@kobalte/core";
import { ParentProps } from "solid-js";

const BaseRequiredIndicator = hope("span", {
  baseStyle: {
    color: "danger.500",
    _dark: {
      color: "danger.600",
    },
  },
});

export function RequiredIndicator(props: ParentProps) {
  return (
    <span>
      {props.children}
      <BaseRequiredIndicator>*</BaseRequiredIndicator>
    </span>
  );
}
