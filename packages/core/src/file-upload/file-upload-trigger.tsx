import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";
import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useFileUploadContext } from "./file-upload-root-provider";

export interface FileUploadTriggerOptions {
	children?: JSX.Element;
}

export interface FileUploadTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id?: string;
	style?: JSX.CSSProperties | string;
	"aria-label"?: string;
	onClick?: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface FileUploadTriggerRenderProps
	extends FileUploadTriggerCommonProps,
		Button.ButtonRootRenderProps {}

export type FileUploadTriggerRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadTriggerOptions &
	Partial<FileUploadTriggerCommonProps<ElementOf<T>>>;

export function FileUploadTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, FileUploadTriggerRootProps<T>>,
) {
	const context = useFileUploadContext();

	const [local, others] = splitProps(props as FileUploadTriggerRootProps, [
		"aria-label",
	]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (event) => {
		// if button is within dropzone ref, avoid trigger of file dialog for button
		if (context.dropzoneRef?.contains(event.target as HTMLElement)) {
			event.stopPropagation();
		}
		// open the hidden input
		context.fileInputRef?.click();
	};

	return (
		<Button.Root<
			Component<
				Omit<FileUploadTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			aria-label={local["aria-label"]}
			disabled={!!context.disabled}
			id={context.inputId}
			onClick={onClick}
			{...(props as FileUploadTriggerRootProps)}
		/>
	);
}
