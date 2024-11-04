import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { FileUploadProvider } from "./file-upload-root-provider";

import type { FileUploadRootOptions } from "./types";

export type { FileUploadRootOptions };

export interface FileUploadCommonProps<T extends HTMLElement = HTMLElement> {
	id?: string;
	style?: JSX.CSSProperties | string;
}

export type FileUploadRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadRootOptions & Partial<FileUploadCommonProps<ElementOf<T>>>;

export function FileUpload<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadRootProps<T>>,
) {
	return (
		<FileUploadProvider {...props}>
			<Polymorphic as="div" {...props}>
				{props.children}
			</Polymorphic>
		</FileUploadProvider>
	);
}
