import { composeEventHandlers } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";
import * as Button from "../button";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useFileFieldContext } from "./file-field-context";

export interface FileFieldTriggerOptions {}

export interface FileFieldTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface FileFieldTriggerRenderProps
	extends FileFieldTriggerCommonProps,
		FormControlDataSet,
		Button.ButtonRootRenderProps {}

export type FileFieldTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileFieldTriggerOptions &
	Partial<FileFieldTriggerCommonProps<ElementOf<T>>>;

export function FileFieldTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, FileFieldTriggerProps<T>>,
) {
	const context = useFileFieldContext();
	const formControlContext = useFormControlContext();

	const [local, others] = splitProps(props as FileFieldTriggerProps, [
		"onClick",
	]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (event) => {
		// if button is within dropzone ref, avoid trigger of file dialog for button
		if (context.dropzoneRef()?.contains(event.target as HTMLElement)) {
			event.stopPropagation();
		}
		// open the hidden input
		context.fileInputRef()?.click();
	};

	return (
		<Button.Root<
			Component<
				Omit<FileFieldTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			disabled={context.disabled()}
			onClick={composeEventHandlers([local.onClick, onClick])}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
