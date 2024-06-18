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

export interface ToastTitleOptions {}

export interface ToastTitleCommonProps<T extends HTMLElement = HTMLElement> {
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

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("title"),
		},
		props as ToastTitleProps,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerTitleId(local.id)));

	return (
		<Polymorphic<ToastTitleRenderProps> as="div" id={local.id} {...others} />
	);
}
