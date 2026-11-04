import type { ValidComponent } from "@solidjs/web";
import {
	FormControlErrorMessage,
	type FormControlErrorMessageCommonProps,
	type FormControlErrorMessageOptions,
	type FormControlErrorMessageProps,
	type FormControlErrorMessageRenderProps,
} from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

export type {
	FormControlErrorMessageCommonProps as TagsInputErrorMessageCommonProps,
	FormControlErrorMessageOptions as TagsInputErrorMessageOptions,
	FormControlErrorMessageRenderProps as TagsInputErrorMessageRenderProps,
};

export type TagsInputErrorMessageProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FormControlErrorMessageProps<ElementOf<T>>;

export function TagsInputErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TagsInputErrorMessageProps<T>>,
) {
	return <FormControlErrorMessage<T> {...(props as any)} />;
}
