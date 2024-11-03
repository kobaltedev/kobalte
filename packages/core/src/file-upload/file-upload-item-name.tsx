import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
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
		<Polymorphic as="div" {...props}>
			{props.children || file.name}
		</Polymorphic>
	);
}
