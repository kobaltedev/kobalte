import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadItemContext } from "./file-upload-item-context";

export interface FileUploadItemNameOptions {}

export interface FileUploadItemNameCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	children: JSX.Element;
}

export interface FileUploadItemNameRenderProps
	extends FileUploadItemNameCommonProps {}

export type FileUploadItemNameRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadItemNameOptions &
	Partial<FileUploadItemNameCommonProps<ElementOf<T>>>;

export function FileUploadItemName<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadItemNameRootProps<T>>,
) {
	const { file } = useFileUploadItemContext();

	return (
		<Polymorphic<FileUploadItemNameRenderProps>
			as="div"
			{...(props as FileUploadItemNameRootProps)}
		>
			{props.children ?? file.name}
		</Polymorphic>
	);
}
