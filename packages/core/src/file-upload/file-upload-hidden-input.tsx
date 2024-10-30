import type { JSX, ValidComponent } from "solid-js";
import {
	Polymorphic,
	type ElementOf,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadContext } from "./file-upload-root-provider";

export interface FileUploadHiddenInputCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id?: string;
	style?: JSX.CSSProperties | string;
}

export type FileUploadHiddenInputRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadHiddenInputCommonProps<ElementOf<T>>>;

export function FileUploadHiddenInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, FileUploadHiddenInputRootProps<T>>,
) {
	const context = useFileUploadContext();

	const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
		if (context.disabled) {
			return;
		}

		const { files } = event.currentTarget;
		console.log("files", files);
		const t = Array.from(files ?? []);
		context.processFiles(Array.from(files ?? []));
	};

	return (
		<Polymorphic
			as="input"
			type="file"
			id={context.inputId}
			accept={context.accept}
			multiple={context.multiple}
			ref={(el: HTMLInputElement) => (context.fileInputRef = el)}
			style={{ display: "none" }}
			onChange={onInput}
		>
			{props.children}
		</Polymorphic>
	);
}
