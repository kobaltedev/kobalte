import type { ComponentProps } from "solid-js";
import { ColorAreaHiddenInputBase } from "./color-area-hidden-input-base.tsx";

export type ColorAreaHiddenInputYProps = ComponentProps<"input">;

export function ColorAreaHiddenInputY(props: ColorAreaHiddenInputYProps) {
	return <ColorAreaHiddenInputBase orientation="vertical" {...props} />;
}
