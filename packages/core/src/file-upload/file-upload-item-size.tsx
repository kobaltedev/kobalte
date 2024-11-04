import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { useFileUploadItemContext } from "./file-upload-item-provider";

export type FileUploadItemSizeOptions = {
	precision?: number;
};

export type FileUploadItemSizeCommonProps<T extends HTMLElement = HTMLElement> =
	{
		id?: string;
		style?: JSX.CSSProperties | string;
	};

export type FileUploadItemSizeRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadItemSizeOptions &
	Partial<FileUploadItemSizeCommonProps<ElementOf<T>>>;

function formatBytes(bytes: number, precision = 2): string {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(precision))} ${sizes[i]}`;
}

export function FileUploadItemSize<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadItemSizeRootProps<T>>,
) {
	const { file } = useFileUploadItemContext();

	return (
		<Polymorphic as="div" {...props}>
			{formatBytes(file.size, props.precision)}
		</Polymorphic>
	);
}
