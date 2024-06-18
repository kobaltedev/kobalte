import type { Component, ValidComponent } from "solid-js";
import {
	DialogContent,
	type DialogContentCommonProps,
	type DialogContentOptions,
	type DialogContentRenderProps,
} from "../dialog/dialog-content";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

export interface AlertDialogContentOptions extends DialogContentOptions {}

export interface AlertDialogContentCommonProps<
	T extends HTMLElement = HTMLElement,
> extends DialogContentCommonProps<T> {}

export interface AlertDialogContentRenderProps
	extends AlertDialogContentCommonProps,
		DialogContentRenderProps {
	role: "alertdialog";
}

export type AlertDialogContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = AlertDialogContentOptions &
	Partial<AlertDialogContentCommonProps<ElementOf<T>>>;

/**
 * Overrides the regular `Dialog.Content` with role="alertdialog" to interrupt the user.
 */
export function AlertDialogContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, AlertDialogContentProps<T>>,
) {
	return (
		<DialogContent<
			Component<
				Omit<
					AlertDialogContentRenderProps,
					Exclude<keyof DialogContentRenderProps, "role">
				>
			>
		>
			role="alertdialog"
			{...(props as AlertDialogContentProps)}
		/>
	);
}
