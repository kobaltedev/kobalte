import {
	ColorAreaHiddenInputBase,
	type ColorAreaHiddenInputBaseProps,
} from "./color-area-hidden-input-base.tsx";

export type ColorAreaHiddenInputYProps = ColorAreaHiddenInputBaseProps;

export function ColorAreaHiddenInputY(props: ColorAreaHiddenInputYProps) {
	return <ColorAreaHiddenInputBase orientation="vertical" {...props} />;
}
