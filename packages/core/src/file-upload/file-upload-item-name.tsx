import type { JSX, ValidComponent } from "solid-js";
import {
	Polymorphic,
	type ElementOf,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadItemContext } from "./file-upload-item-provider";

export type FileUploadItemNameCommonProps<T extends HTMLElement = HTMLElement> =
	{
		id?: string;
		style?: JSX.CSSProperties | string;
	};

export type FileUploadItemNameRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadItemNameCommonProps<ElementOf<T>>>;

export function FileUploadItemName<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadItemNameRootProps<T>>,
) {
	const { file } = useFileUploadItemContext();

	return (
		<Polymorphic as="div" class="file-upload__item-name" {...props}>
			{props.children || file.name}
		</Polymorphic>
	);
}
