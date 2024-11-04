import { mergeRefs, visuallyHiddenStyles } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import { JSX, splitProps, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadContext } from "./file-upload-root-provider";

export interface FileUploadHiddenInputOptions {}

export interface FileUploadHiddenInputCommonProps<
	T extends HTMLInputElement = HTMLInputElement,
> {
	ref: T | ((el: T) => void);
	id: string;
	style: JSX.CSSProperties | string;
}

export interface FileUploadHiddenInputRenderProps extends FileUploadHiddenInputCommonProps {
	type: "file";
	accepts: string | undefined;
	multiple: boolean | undefined;
}

export type FileUploadHiddenInputRootProps<
	T extends ValidComponent | HTMLInputElement = HTMLInputElement,
> = FileUploadHiddenInputOptions & Partial<FileUploadHiddenInputCommonProps<ElementOf<T>>>;

export function FileUploadHiddenInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, FileUploadHiddenInputRootProps<T>>,
) {
	const [local, others] = splitProps(props as FileUploadHiddenInputRootProps<T>, ["style", "ref"])

	const context = useFileUploadContext();

	const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
		if (context.disabled) {
			return;
		}

		const { files } = event.currentTarget;
		context.processFiles(Array.from(files ?? []));
	};

	return (
		<Polymorphic<FileUploadHiddenInputRenderProps>
			as="input"
			type="file"
			id={context.inputId}
			accept={context.accept()}
			multiple={context.multiple()}
			ref={mergeRefs(context.setFileInputRef, local.ref)}
			style={combineStyle({ ...visuallyHiddenStyles }, local.style)}
			onChange={onInput}
			{...others}
		>
			{props.children}
		</Polymorphic>
	);
}
