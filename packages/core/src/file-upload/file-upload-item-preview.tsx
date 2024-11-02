import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadItemContext } from "./file-upload-item-provider";

export type FileUploadItemPreviewOptions = {
	type: string;
};

export interface FileUploadItemPreviewCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id?: string;
	style?: JSX.CSSProperties | string;
}

export type FileUploadItemPreviewRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadItemPreviewOptions &
	Partial<FileUploadItemPreviewCommonProps<ElementOf<T>>>;

export function FileUploadItemPreview<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadItemPreviewRootProps<T>>,
) {
	const { file } = useFileUploadItemContext();

	if (!file.type.match(props.type ?? ".*")) {
		return null;
	}

	return (
		<Polymorphic as="div" class="file-upload__item-preview" {...props}>
			{props.children}
		</Polymorphic>
	);
}
