import { Component, ValidComponent } from "solid-js";
import {
	DialogContent,
	DialogContentCommonProps,
	DialogContentOptions,
	DialogContentRenderProps,
} from "../dialog/dialog-content";
import { PolymorphicProps } from "../polymorphic";

export interface AlertDialogContentOptions extends DialogContentOptions {}

export interface AlertDialogContentCommonProps
	extends DialogContentCommonProps {}

export interface AlertDialogContentRenderProps
	extends AlertDialogContentCommonProps,
		DialogContentRenderProps {
	role: "alertdialog";
}

export type AlertDialogContentProps = AlertDialogContentOptions &
	Partial<AlertDialogContentCommonProps>;

/**
 * Overrides the regular `Dialog.Content` with role="alertdialog" to interrupt the user.
 */
export function AlertDialogContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, AlertDialogContentProps>,
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
