import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useToastContext } from "./toast-context";

export interface ToastTitleOptions extends AsChildProp {}

export type ToastTitleProps = OverrideComponentProps<"div", ToastTitleOptions>;

/**
 * An accessible title to be announced when the toast is open.
 */
export function ToastTitle(props: ToastTitleProps) {
	const context = useToastContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("title"),
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerTitleId(local.id!)));

	return <Polymorphic as="div" id={local.id} {...others} />;
}
