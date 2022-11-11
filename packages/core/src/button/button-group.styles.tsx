import { bem, cva } from "../utils";
import { ButtonGroupVariants } from "./types";

const bemButtonGroup = bem("kb-button-group");

export const buttonGroupStyles = cva<"root", ButtonGroupVariants>(
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
