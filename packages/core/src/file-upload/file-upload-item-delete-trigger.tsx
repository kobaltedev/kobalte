import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { useFileUploadItemContext } from "./file-upload-item-provider";
import { useFileUploadContext } from "./file-upload-root-provider";

export type FileUploadItemDeleteTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type FileUploadItemDeleteTriggerRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadItemDeleteTriggerCommonProps<ElementOf<T>>>;

export function FileUploadItemDeleteTrigger<
	T extends ValidComponent = "button",
>(props: PolymorphicProps<T, FileUploadItemDeleteTriggerRootProps<T>>) {
	const context = useFileUploadContext();
	const { file } = useFileUploadItemContext();

	const handleDelete = () => {
		if (context.disabled) {
			return;
		}
		context.removeFile(file);
	};

	return (
		<Polymorphic
			as="button"
			onClick={handleDelete}
			disabled={context.disabled}
			{...props}
		>
			{props.children}
		</Polymorphic>
	);
}
