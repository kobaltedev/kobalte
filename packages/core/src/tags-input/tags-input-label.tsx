import type { ValidComponent } from "@solidjs/web";
import {
	FormControlLabel,
	type FormControlLabelCommonProps,
	type FormControlLabelOptions,
	type FormControlLabelProps,
	type FormControlLabelRenderProps,
} from "../form-control";
import type { PolymorphicProps } from "../polymorphic";

export type {
	FormControlLabelCommonProps as TagsInputLabelCommonProps,
	FormControlLabelOptions as TagsInputLabelOptions,
	FormControlLabelRenderProps as TagsInputLabelRenderProps,
};

export type TagsInputLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FormControlLabelProps<T>;

export function TagsInputLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, TagsInputLabelProps<T>>,
) {
	return <FormControlLabel<T> {...(props as any)} />;
}
