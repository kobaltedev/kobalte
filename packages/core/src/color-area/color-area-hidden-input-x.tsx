import type { ComponentProps } from "solid-js";
import { ColorAreaHiddenInputBase } from "./color-area-hidden-input-base.tsx";

export type ColorAreaHiddenInputXProps = ComponentProps<"input">;

export function ColorAreaHiddenInputX(props: ColorAreaHiddenInputXProps) {
	return <ColorAreaHiddenInputBase {...props} />;
}
