import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadContext } from "./file-upload-root-provider";

export type FileUploadLabelCommonProps<T extends HTMLElement = HTMLElement> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type FileUploadLabelRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadLabelCommonProps<ElementOf<T>>>;

export function FileUploadLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, FileUploadLabelRootProps<T>>,
) {
	const context = useFileUploadContext();

	return (
		<Polymorphic as="label" htmlFor={context.inputId} {...props}>
			{props.children}
		</Polymorphic>
	);
}
