import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { useFileUploadItemContext } from "./file-upload-item-context";

export interface FileUploadItemSizeOptions {
	precision?: number;
}

export interface FileUploadItemSizeCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileUploadItemSizeRenderProps
	extends FileUploadItemSizeCommonProps {
	children: JSX.Element;
}

export type FileUploadItemSizeRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadItemSizeOptions &
	Partial<FileUploadItemSizeCommonProps<ElementOf<T>>>;

function formatBytes(
	bytes: number,
	precision: number,
	sizes: string[],
): string {
	if (bytes === 0) return `0 ${size[0]}`;
	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(precision))} ${sizes[i]}`;
}

export function FileUploadItemSize<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadItemSizeRootProps<T>>,
) {
	const { translations } = useFileUploadContext();
	const size = () => [
		translations().bytes,
		translations().kb,
		translations().mb,
		translations().gb,
		translations().tb,
	];
	const { file } = useFileUploadItemContext();

	const [local, others] = splitProps(props as FileUploadItemSizeRootProps, [
		"precision",
	]);

	return (
		<Polymorphic<FileUploadItemSizeRenderProps> as="div" {...others}>
			{formatBytes(file.size, local.precision ?? 2, size())}
		</Polymorphic>
	);
}
