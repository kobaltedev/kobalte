import type { ComponentProps } from "@solidjs/web";
import { ColorAreaHiddenInputBase } from "./color-area-hidden-input-base";

export type ColorAreaHiddenInputXProps = ComponentProps<"input">;

export function ColorAreaHiddenInputX(props: ColorAreaHiddenInputXProps) {
	return <ColorAreaHiddenInputBase {...props} />;
}
