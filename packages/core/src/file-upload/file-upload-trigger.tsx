import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadContext } from "./file-upload-root-provider";

export type FileUploadTriggerCommonProps<T extends HTMLElement = HTMLElement> =
	{
		id?: string;
		style?: JSX.CSSProperties | string;
	};

export type FileUploadTriggerRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadTriggerCommonProps<ElementOf<T>>>;

export function FileUploadTrigger<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, FileUploadTriggerRootProps<T>>,
) {
	const context = useFileUploadContext();

	return (
		<Polymorphic
			disabled={!!context.disabled}
			as="button"
			type="button"
			class="file-upload__trigger"
			id={context.inputId}
			onClick={(event: MouseEvent) => {
				// if button is within dropzone ref, avoid trigger of file dialog for button
				if (context.dropzoneRef?.contains(event.target as HTMLElement)) {
					event.stopPropagation();
				}
				// open the hidden input
				context.fileInputRef?.click();
			}}
			{...props}
		>
			{props.children}
		</Polymorphic>
	);
}
