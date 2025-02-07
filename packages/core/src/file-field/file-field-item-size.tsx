import { type JSX, type ValidComponent, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { useFileFieldContext } from "./file-field-context";
import { useFileFieldItemContext } from "./file-field-item-context";

export interface FileFieldItemSizeOptions {
	precision?: number;
}

export interface FileFieldItemSizeCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileFieldItemSizeRenderProps
	extends FileFieldItemSizeCommonProps {
	children: JSX.Element;
}

export type FileFieldItemSizeProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileFieldItemSizeOptions &
	Partial<FileFieldItemSizeCommonProps<ElementOf<T>>>;

function formatBytes(
	bytes: number,
	precision: number,
	sizes: string[],
): string {
	if (bytes === 0) return `0 ${sizes[0]}`;
	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(precision))} ${sizes[i]}`;
}

export function FileFieldItemSize<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, FileFieldItemSizeProps<T>>,
) {
	const { translations } = useFileFieldContext();
	const size = () => [
		translations().bytes,
		translations().kb,
		translations().mb,
		translations().gb,
		translations().tb,
	];
	const { file } = useFileFieldItemContext();

	const [local, others] = splitProps(props as FileFieldItemSizeProps, [
		"precision",
	]);

	return (
		<Polymorphic<FileFieldItemSizeRenderProps> as="span" {...others}>
			{formatBytes(file.size, local.precision ?? 2, size())}
		</Polymorphic>
	);
}
