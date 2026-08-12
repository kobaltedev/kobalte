import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useDialogContext } from "./dialog-context.tsx";

export interface DialogTitleOptions {}

export interface DialogTitleCommonProps<_T extends HTMLElement = HTMLElement> {
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

	const mergedProps = merge(
		{
			id: context.generateId("title"),
		},
		props as DialogTitleProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerTitleId(id),
	);

	return (
		<Polymorphic<DialogTitleRenderProps>
			as="h2"
			id={mergedProps.id}
			{...others}
		/>
	);
}
