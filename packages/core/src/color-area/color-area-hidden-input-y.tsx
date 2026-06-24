import { type ColorAreaHiddenInputBaseProps, ColorAreaHiddenInputBase } from "./color-area-hidden-input-base";

export type ColorAreaHiddenInputYProps = ColorAreaHiddenInputBaseProps;

export function ColorAreaHiddenInputY(props: ColorAreaHiddenInputYProps) {
	return <ColorAreaHiddenInputBase orientation="vertical" {...props} />;
}
