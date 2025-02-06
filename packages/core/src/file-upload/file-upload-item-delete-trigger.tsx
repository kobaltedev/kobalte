import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { useFileUploadItemContext } from "./file-upload-item-context";
import { useFileUploadContext } from "./file-upload-root-provider";

export interface FileUploadItemDeleteTriggerOptions {}

export interface FileUploadItemDeleteTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface FileUploadItemDeleteTriggerRenderProps
	extends FileUploadItemDeleteTriggerCommonProps,
		Button.ButtonRootRenderProps {
	disabled: boolean | undefined;
}

export type FileUploadItemDeleteTriggerRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadItemDeleteTriggerCommonProps<ElementOf<T>>>;

export function FileUploadItemDeleteTrigger<
	T extends ValidComponent = "button",
>(props: PolymorphicProps<T, FileUploadItemDeleteTriggerRootProps<T>>) {
	const context = useFileUploadContext();
	const { file } = useFileUploadItemContext();

	const [local, others] = splitProps(
		props as FileUploadItemDeleteTriggerRootProps,
		["onClick"],
	);

	const handleDelete = () => {
		context.removeFile(file);
	};

	return (
		<Button.Root<
			Component<
				Omit<FileUploadTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			onClick={composeEventHandlers([local.onClick, handleDelete])}
			disabled={context.disabled()}
			{...others}
		/>
	);
}
