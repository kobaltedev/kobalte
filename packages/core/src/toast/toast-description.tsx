import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useToastContext } from "./toast-context.tsx";

export interface ToastDescriptionOptions {}

export interface ToastDescriptionCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface ToastDescriptionRenderProps
	extends ToastDescriptionCommonProps {}

export type ToastDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToastDescriptionOptions &
	Partial<ToastDescriptionCommonProps<ElementOf<T>>>;

/**
 * An optional accessible description to be announced when the toast is open.
 */
export function ToastDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ToastDescriptionProps<T>>,
) {
	const context = useToastContext();

	const mergedProps = merge(
		{
			id: context.generateId("description"),
		},
		props as ToastDescriptionProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerDescriptionId(id!),
	);

	return (
		<Polymorphic<ToastDescriptionRenderProps>
			as="div"
			id={mergedProps.id}
			{...others}
		/>
	);
}
