import type { ValidComponent } from "@solidjs/web";
import {
	FormControlDescription,
	type FormControlDescriptionCommonProps,
	type FormControlDescriptionOptions,
	type FormControlDescriptionProps,
	type FormControlDescriptionRenderProps,
} from "../form-control";
import type { PolymorphicProps } from "../polymorphic";

export type {
	FormControlDescriptionCommonProps as TagsInputDescriptionCommonProps,
	FormControlDescriptionOptions as TagsInputDescriptionOptions,
	FormControlDescriptionRenderProps as TagsInputDescriptionRenderProps,
};

export type TagsInputDescriptionProps = FormControlDescriptionProps;

export function TagsInputDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TagsInputDescriptionProps>,
) {
	return <FormControlDescription<T> {...(props as any)} />;
}
