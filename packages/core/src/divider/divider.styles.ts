import { bem, cva } from "../utils";
import { DividerVariants } from "./types";

const bemDivider = bem("kb-divider");

export const dividerLabelClass = bemDivider.withElement("label");

export const dividerStyles = cva<"root", DividerVariants>(
  {
    root: {
      base: bemDivider.block(),
      variants: {
        orientation: {
          horizontal: bemDivider.withModifier("horizontal"),
          vertical: bemDivider.withModifier("vertical"),
        },
        withLabel: {
          true: bemDivider.withModifier("with-label"),
        },
        labelPlacement: {
          start: bemDivider.withModifier("label-start"),
          end: bemDivider.withModifier("label-end"),
        },
      },
    },
  },
  {
    orientation: "horizontal",
    labelPlacement: "start",
    withLabel: false,
  }
);
