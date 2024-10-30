import { createUniqueId, type JSX, type ValidComponent } from "solid-js";

import {
	Polymorphic,
	type ElementOf,
	type PolymorphicProps,
} from "../polymorphic";

import { FileUploadProvider } from "./file-upload-root-provider";

import type { FileUploadRootOptions } from "./types";

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
			<Polymorphic as="div" class="file-upload__root">
				{props.children}
			</Polymorphic>
		</FileUploadProvider>
	);
}
