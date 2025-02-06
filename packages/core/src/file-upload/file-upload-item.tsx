import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface FileUploadItemOptions {}

export interface FileUploadItemCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileUploadItemRenderProps extends FileUploadItemCommonProps {}

export type FileUploadItemRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadItemOptions & Partial<FileUploadItemCommonProps<ElementOf<T>>>;

// TODO: replace with List
export function FileUploadItem<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, FileUploadItemRootProps<T>>,
) {
	return (
		<Polymorphic<FileUploadItemRenderProps>
			as="li"
			{...(props as FileUploadItemRootProps)}
		/>
	);
}
