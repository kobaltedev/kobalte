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

export interface DialogDescriptionOptions {}

export interface DialogDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface DialogDescriptionRenderProps
	extends DialogDescriptionCommonProps {}

export type DialogDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DialogDescriptionOptions &
	Partial<DialogDescriptionCommonProps<ElementOf<T>>>;

/**
 * An optional accessible description to be announced when the dialog is open.
 */
export function DialogDescription<T extends ValidComponent = "p">(
	props: PolymorphicProps<T, DialogDescriptionProps<T>>,
) {
	const context = useDialogContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as DialogDescriptionProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(() => mergedProps.id, (id) => context.registerDescriptionId(id!));

	return (
		<Polymorphic<DialogDescriptionRenderProps>
			as="p"
			id={mergedProps.id}
			{...others}
		/>
	);
}
