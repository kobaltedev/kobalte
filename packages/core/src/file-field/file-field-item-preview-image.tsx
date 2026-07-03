import type { ValidComponent } from "@solidjs/web";
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
	const { file } = useFileFieldItemContext();

	return (
		<FileFieldItemPreview type="image/*">
			<Polymorphic<FileFieldItemPreviewImageRenderProps>
				as="img"
				src={file.source}
				{...(props as FileFieldItemPreviewImageProps)}
			/>
		</FileFieldItemPreview>
	);
}
