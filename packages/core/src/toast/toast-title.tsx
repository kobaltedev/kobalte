import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useToastContext } from "./toast-context.tsx";

export interface ToastTitleOptions {}

export interface ToastTitleCommonProps<_T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface ToastTitleRenderProps extends ToastTitleCommonProps {}

export type ToastTitleProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToastTitleOptions & Partial<ToastTitleCommonProps<ElementOf<T>>>;

/**
 * An accessible title to be announced when the toast is open.
 */
export function ToastTitle<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ToastTitleProps<T>>,
) {
	const context = useToastContext();

	const mergedProps = merge(
		{
			id: context.generateId("title"),
		},
		props as ToastTitleProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerTitleId(id),
	);

	return (
		<Polymorphic<ToastTitleRenderProps>
			as="div"
			id={mergedProps.id}
			{...others}
		/>
	);
}
