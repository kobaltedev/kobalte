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
import { useFileUploadItemContext } from "./file-upload-item-provider";

export type FileUploadItemPreviewImageProps<
	T extends HTMLElement = HTMLElement,
> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type FileUploadItemPreviewImageRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadItemPreviewImageProps<ElementOf<T>>>;

export function FileUploadItemPreviewImage<T extends ValidComponent = "img">(
	props: PolymorphicProps<T, FileUploadItemPreviewImageRootProps<T>>,
) {
	const [url, setUrl] = createSignal<string>("");

	const { file } = useFileUploadItemContext();

	const createFileUrl = (file: File, callback: (url: string) => void) => {
		const win = window;
		const url = win.URL.createObjectURL(file);
		callback(url);
		return () => win.URL.revokeObjectURL(url);
	};

	createEffect(() => {
		const isImage = file.type.startsWith("image/");
		if (!isImage) {
			throw new Error("Preview Image is only supported for image files");
		}

		const cleanup = createFileUrl(file, (url) => setUrl(url));
		onCleanup(cleanup);
	});

	return <Polymorphic as="img" src={url()} {...props} />;
}
