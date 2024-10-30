import type { JSX, ValidComponent } from "solid-js";
import {
	Polymorphic,
	type ElementOf,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadContext } from "./file-upload-root-provider";

export interface FileUploadLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id?: string;
	style?: JSX.CSSProperties | string;
}

export type FileUploadLabelRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadLabelCommonProps<ElementOf<T>>>;

export function FileUploadLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, FileUploadLabelRootProps<T>>,
) {
	const context = useFileUploadContext();

	return <Polymorphic as="label" class="file-upload__label" htmlFor={context.inputId}>{props.children}</Polymorphic>;
}
