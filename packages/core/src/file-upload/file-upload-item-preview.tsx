import { type JSX, Show, type ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadItemContext } from "./file-upload-item-context";

export interface FileUploadItemPreviewOptions {
	type: string;
}

export interface FileUploadItemPreviewCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileUploadItemPreviewRenderProps
	extends FileUploadItemPreviewCommonProps {}

export type FileUploadItemPreviewRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadItemPreviewOptions &
	Partial<FileUploadItemPreviewCommonProps<ElementOf<T>>>;

export function FileUploadItemPreview<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadItemPreviewRootProps<T>>,
) {
	const { file } = useFileUploadItemContext();

	const [local, others] = splitProps(props as FileUploadItemPreviewRootProps, [
		"type",
	]);

	return (
		<Show when={file.type.match(local.type ?? ".*")}>
			<Polymorphic<FileUploadItemPreviewRenderProps> as="div" {...others} />
		</Show>
	);
}
