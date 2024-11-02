import { type JSX, Show, type ValidComponent } from "solid-js";
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

	return (
		<Show when={file.type.match(props.type ?? ".*")} fallback={null}>
			<Polymorphic as="div" {...props}>
				{props.children}
			</Polymorphic>
		</Show>
	);
}
