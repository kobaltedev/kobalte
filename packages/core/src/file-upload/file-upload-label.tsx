import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadContext } from "./file-upload-root-provider";

export interface FileUploadLabelOptions {}

export interface FileUploadLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileUploadLabelRenderProps extends FileUploadLabelCommonProps {
	for: string;
}

export type FileUploadLabelRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadLabelOptions & Partial<FileUploadLabelCommonProps<ElementOf<T>>>;

export function FileUploadLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, FileUploadLabelRootProps<T>>,
) {
	const context = useFileUploadContext();

	return (
		<Polymorphic<FileUploadLabelRenderProps>
			as="label"
			for={context.inputId}
			{...(props as FileUploadLabelRootProps)}
		/>
	);
}
