import { type JSX, type ValidComponent, createSignal } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { useFileUploadContext } from "./file-upload-root-provider";
import { isDragEventWithFiles } from "./util";

export type FileUploadDropZoneCommonProps<T extends HTMLElement = HTMLElement> =
	{
		id?: string;
		style?: JSX.CSSProperties | string;
	};

export type FileUploadDropZoneRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadDropZoneCommonProps<ElementOf<T>>>;

export function FileUploadDropZone<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadDropZoneRootProps<T>>,
) {
	const [isDragging, setIsDragging] = createSignal(false);
	const context = useFileUploadContext();

	return (
		<Polymorphic
			as="div"
			aria-label="dropzone"
			role="button"
			tabindex="0"
			aria-disabled={context.disabled}
			data-dragging={isDragging()}
			ref={(el: HTMLInputElement) => (context.dropzoneRef = el)}
			onClick={(event: MouseEvent) => {
				// if label is within file dropzone, avoid opening up file dialog
				if ((event.target as HTMLInputElement).tagName === "LABEL") {
					event.stopPropagation();
				} else {
					// open the hidden input
					context.fileInputRef?.click();
				}
			}}
			onKeyDown={(event: KeyboardEvent) => {
				if (event.defaultPrevented) {
					return;
				}
				if (event.key !== "Enter" && event.key !== " ") {
					return;
				}
				// open the file dialog if user presses space and enter key
				context.fileInputRef?.click();
			}}
			onDragOver={(event: DragEvent) => {
				if (!context.allowDragAndDrop || context.disabled) {
					return;
				}
				event.preventDefault();

				try {
					if (event.dataTransfer) {
						event.dataTransfer.dropEffect = "copy";
					}
				} catch {}
				const isFilesEvent = isDragEventWithFiles(event);
				if ((event.dataTransfer?.items ?? []).length > 0) {
					setIsDragging(true);
				}
			}}
			onDragLeave={(event: DragEvent) => {
				if (!context.allowDragAndDrop || context.disabled) {
					return;
				}
				setIsDragging(false);
			}}
			onDrop={(event: DragEvent) => {
				if (context.allowDragAndDrop) {
					event.preventDefault();
					event.stopPropagation();
				}

				const isFilesEvent = isDragEventWithFiles(event);
				if (context.disabled || !isFilesEvent) {
					return;
				}
				const files = event.dataTransfer?.files;
				const fileList = Array.from(files ?? []);
				context.processFiles(fileList);
			}}
			{...props}
		>
			{props.children}
		</Polymorphic>
	);
}
