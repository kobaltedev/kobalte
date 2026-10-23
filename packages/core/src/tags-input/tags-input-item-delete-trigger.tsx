import { composeEventHandlers } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";
import * as Button from "../button";
import { useFormControlContext } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useTagsInputContext } from "./tags-input-context";
import { useTagsInputItemContext } from "./tags-input-item-context";

export interface TagsInputItemDeleteTriggerOptions {}

export interface TagsInputItemDeleteTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	"aria-label": string | undefined;
}

export interface TagsInputItemDeleteTriggerRenderProps
	extends TagsInputItemDeleteTriggerCommonProps,
		Button.ButtonRootRenderProps {
	disabled: boolean | undefined;
}

export type TagsInputItemDeleteTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TagsInputItemDeleteTriggerOptions &
	Partial<TagsInputItemDeleteTriggerCommonProps<ElementOf<T>>>;

/**
 * Removes the tag it belongs to.
 */
export function TagsInputItemDeleteTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TagsInputItemDeleteTriggerProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useTagsInputContext();
	const itemContext = useTagsInputItemContext();

	const others = omit(
		props as TagsInputItemDeleteTriggerProps,
		"onClick",
		"aria-label",
	);

	const isDisabled = () =>
		formControlContext.isDisabled() || formControlContext.isReadOnly();

	const handleDelete = () => {
		context.removeTagAt(itemContext.index());
		context.focusInput();
	};

	return (
		<Button.Root<
			Component<
				Omit<
					TagsInputItemDeleteTriggerRenderProps,
					keyof Button.ButtonRootRenderProps
				>
			>
		>
			onClick={composeEventHandlers([props.onClick, handleDelete])}
			disabled={isDisabled()}
			aria-label={props["aria-label"] ?? `Remove ${itemContext.value()}`}
			{...others}
		/>
	);
}
