import { composeEventHandlers } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";
import * as Button from "../button";
import { useFormControlContext } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useTagsInputContext } from "./tags-input-context";

export interface TagsInputClearTriggerOptions {}

export interface TagsInputClearTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface TagsInputClearTriggerRenderProps
	extends TagsInputClearTriggerCommonProps,
		Button.ButtonRootRenderProps {
	disabled: boolean | undefined;
}

export type TagsInputClearTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TagsInputClearTriggerOptions &
	Partial<TagsInputClearTriggerCommonProps<ElementOf<T>>>;

/**
 * Removes every tag.
 */
export function TagsInputClearTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TagsInputClearTriggerProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useTagsInputContext();

	const others = omit(props as TagsInputClearTriggerProps, "onClick");

	const isDisabled = () =>
		formControlContext.isDisabled() ||
		formControlContext.isReadOnly() ||
		context.value().length === 0;

	return (
		<Button.Root<
			Component<
				Omit<TagsInputClearTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			onClick={composeEventHandlers([props.onClick, () => context.clearTags()])}
			disabled={isDisabled()}
			{...others}
		/>
	);
}
