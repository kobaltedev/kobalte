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
import { useFileFieldItemContext } from "./file-field-item-context";
import { FileFieldItemPreview } from "./file-field-item-preview";

export interface FileFieldItemPreviewImageOptions {}

export interface FileFieldItemPreviewImageCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileFieldItemPreviewImageRenderProps
	extends FileFieldItemPreviewImageCommonProps {
	src: string;
}

export type FileFieldItemPreviewImageProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileFieldItemPreviewImageOptions &
	Partial<FileFieldItemPreviewImageCommonProps<ElementOf<T>>>;

export function FileFieldItemPreviewImage<T extends ValidComponent = "img">(
	props: PolymorphicProps<T, FileFieldItemPreviewImageProps<T>>,
) {
	return (
		<FileFieldItemPreview type="image/*">
			{
				(() => {
					const [url, setUrl] = createSignal("");

					const { file } = useFileFieldItemContext();

					const createFileUrl = (
						file: File,
						callback: (url: string) => void,
					) => {
						const win = window;
						const url = win.URL.createObjectURL(file);
						callback(url);
						return () => win.URL.revokeObjectURL(url);
					};

					createEffect(() => {
						onCleanup(createFileUrl(file, (url) => setUrl(url)));
					});

					return (
						<Polymorphic<FileFieldItemPreviewImageRenderProps>
							as="img"
							src={url()}
							{...(props as FileFieldItemPreviewImageProps)}
						/>
					);
				}) as unknown as JSX.Element
			}
		</FileFieldItemPreview>
	);
}
