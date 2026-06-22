import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import {
	createEffect,
	omit,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useDialogContext } from "./dialog-context";

export interface DialogTitleOptions {}

export interface DialogTitleCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface DialogTitleRenderProps extends DialogTitleCommonProps {}

export type DialogTitleProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DialogTitleOptions & Partial<DialogTitleCommonProps<ElementOf<T>>>;

/**
 * An accessible title to be announced when the dialog is open.
 */
export function DialogTitle<T extends ValidComponent = "h2">(
	props: PolymorphicProps<T, DialogTitleProps<T>>,
) {
	const context = useDialogContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("title"),
		},
		props as DialogTitleProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(() => mergedProps.id, (id) => context.registerTitleId(id));

	return (
		<Polymorphic<DialogTitleRenderProps> as="h2" id={mergedProps.id} {...others} />
	);
}
