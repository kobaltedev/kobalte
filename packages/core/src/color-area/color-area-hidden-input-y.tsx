import type { ComponentProps } from "@solidjs/web";
import { ColorAreaHiddenInputBase } from "./color-area-hidden-input-base";

export type ColorAreaHiddenInputYProps = ComponentProps<"input">;

export function ColorAreaHiddenInputY(props: ColorAreaHiddenInputYProps) {
	return <ColorAreaHiddenInputBase orientation="vertical" {...props} />;
}
