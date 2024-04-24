import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps, ValidComponent } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { useToastContext } from "./toast-context";

export interface ToastTitleOptions {}

export interface ToastTitleCommonProps {
	id: string;
}

export interface ToastTitleRenderProps extends ToastTitleCommonProps {
}

export type ToastTitleProps = ToastTitleOptions & Partial<ToastTitleCommonProps>;

/**
 * An accessible title to be announced when the toast is open.
 */
export function ToastTitle<T extends ValidComponent = "div">(props: PolymorphicProps<T, ToastTitleProps>) {
	const context = useToastContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("title"),
		},
		props as ToastTitleProps,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerTitleId(local.id)));

	return <Polymorphic<ToastTitleRenderProps> as="div" id={local.id} {...others} />;
}
