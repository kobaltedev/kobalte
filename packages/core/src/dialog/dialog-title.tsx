import { mergeDefaultProps } from "@kobalte/utils";
import { ValidComponent, createEffect, onCleanup, splitProps } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { useDialogContext } from "./dialog-context";

export interface DialogTitleOptions {}

export interface DialogTitleCommonProps {
	id: string;
}

export interface DialogTitleRenderProps extends DialogTitleCommonProps {}

export type DialogTitleProps = DialogTitleOptions &
	Partial<DialogTitleCommonProps>;

/**
 * An accessible title to be announced when the dialog is open.
 */
export function DialogTitle<T extends ValidComponent = "h2">(
	props: PolymorphicProps<T, DialogTitleProps>,
) {
	const context = useDialogContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("title"),
		},
		props as DialogTitleProps,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerTitleId(local.id)));

	return (
		<Polymorphic<DialogTitleRenderProps> as="h2" id={local.id} {...others} />
	);
}
