import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useTagsInputContext } from "./tags-input-context";

export interface TagsInputControlOptions {}

export interface TagsInputControlCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocusIn: JSX.EventHandlerUnion<T, FocusEvent>;
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface TagsInputControlRenderProps
	extends TagsInputControlCommonProps,
		FormControlDataSet {
	"data-focus": "" | undefined;
}

export type TagsInputControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TagsInputControlOptions &
	Partial<TagsInputControlCommonProps<ElementOf<T>>>;

/**
 * Contains the tags input's items and text input.
 */
export function TagsInputControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TagsInputControlProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useTagsInputContext();

	const others = omit(
		props as TagsInputControlProps,
		"ref",
		"onClick",
		"onFocusIn",
		"onFocusOut",
	);

	// Clicking anywhere in the control that isn't a more specific interactive
	// child (a tag, its delete trigger, ...) should focus the text input.
	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, props.onClick);

		if (e.target === e.currentTarget) {
			context.focusInput();
		}
	};

	const onFocusIn: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, props.onFocusIn);
		context.setIsFocused(true);
	};

	const onFocusOut: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, props.onFocusOut);

		if (!e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
			context.setIsFocused(false);
		}
	};

	return (
		<Polymorphic<TagsInputControlRenderProps>
			as="div"
			ref={props.ref as (el: HTMLElement) => void}
			onClick={onClick}
			onFocusIn={onFocusIn}
			onFocusOut={onFocusOut}
			data-focus={context.isFocused() ? "" : undefined}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
