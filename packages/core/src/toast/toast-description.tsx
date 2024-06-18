import { mergeDefaultProps } from "@kobalte/utils";
import {
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useToastContext } from "./toast-context";

export interface ToastDescriptionOptions {}

export interface ToastDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
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

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as ToastDescriptionProps,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerDescriptionId(local.id!)));

	return (
		<Polymorphic<ToastDescriptionRenderProps>
			as="div"
			id={local.id}
			{...others}
		/>
	);
}
