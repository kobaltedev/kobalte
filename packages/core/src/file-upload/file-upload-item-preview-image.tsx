import {
	type JSX,
	type ValidComponent,
	createEffect,
	createSignal,
	onCleanup,
} from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadItemContext } from "./file-upload-item-context";

export interface FileUploadItemPreviewImageOptions {}

export interface FileUploadItemPreviewImageProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileUploadItemPreviewImageRenderProps
	extends FileUploadItemPreviewImageCommonProps {
	src: string;
}

export type FileUploadItemPreviewImageRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadItemPreviewImageOptions &
	Partial<FileUploadItemPreviewImageProps<ElementOf<T>>>;

export function FileUploadItemPreviewImage<T extends ValidComponent = "img">(
	props: PolymorphicProps<T, FileUploadItemPreviewImageRootProps<T>>,
) {
	return (
		<FileUpload.ItemPreview type="image/*">
			{() => {
				const [url, setUrl] = createSignal("");

				const { file } = useFileUploadItemContext();

				const createFileUrl = (file: File, callback: (url: string) => void) => {
					const win = window;
					const url = win.URL.createObjectURL(file);
					callback(url);
					return () => win.URL.revokeObjectURL(url);
				};

				createEffect(() => {
					onCleanup(createFileUrl(file, (url) => setUrl(url)));
				});

				return (
					<Polymorphic<FileUploadItemPreviewImageRenderProps>
						as="img"
						src={url()}
						{...(props as FileUploadItemPreviewImageRootProps)}
					/>
				);
			}}
		</FileUpload.ItemPreview>
	);
}
