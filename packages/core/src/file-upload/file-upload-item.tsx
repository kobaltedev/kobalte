import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { FileUploadItemProvider } from "./file-upload-item-provider";

export type FileUploadItemOptions = {
	file: File;
};

export type FileUploadItemCommonProps<T extends HTMLElement = HTMLElement> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type FileUploadItemRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadItemOptions & Partial<FileUploadItemCommonProps<ElementOf<T>>>;

export function FileUploadItem<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, FileUploadItemRootProps<T>>,
) {
	return (
		<FileUploadItemProvider file={props.file}>
			<Polymorphic as="li" {...props}>
				{props.children}
			</Polymorphic>
		</FileUploadItemProvider>
	);
}
