import {
	type JSX,
	type ValidComponent,
	createSignal,
	splitProps,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { composeEventHandlers, mergeRefs } from "@kobalte/utils";
import { useFileUploadContext } from "./file-upload-context";
import { isDragEventWithFiles } from "./util";

export interface FileUploadDropZoneOptions {}

export interface FileUploadDropZoneCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onDragOver: JSX.EventHandlerUnion<T, DragEvent>;
	onDragLeave: JSX.EventHandlerUnion<T, DragEvent>;
	onDrop: JSX.EventHandlerUnion<T, DragEvent>;
}

export interface FileUploadDropZoneRenderProps
	extends FileUploadDropZoneCommonProps {
	"aria-label": "dropzone";
	role: "button";
	tabindex: "0";
	"aria-disabled": boolean | undefined;
	"data-dragging": boolean;
}

export type FileUploadDropZoneProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadDropZoneOptions &
	Partial<FileUploadDropZoneCommonProps<ElementOf<T>>>;

export function FileUploadDropzone<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadDropZoneProps<T>>,
) {
	const [isDragging, setIsDragging] = createSignal(false);
	const context = useFileUploadContext();

	const [local, others] = splitProps(props as FileUploadDropZoneProps, [
		"ref",
		"onClick",
		"onKeyDown",
		"onDragOver",
		"onDragLeave",
		"onDrop",
	]);

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		// if label is within file dropzone, avoid opening up file dialog
		if (e.target.tagName === "LABEL") {
			e.stopPropagation();
		} else {
			// open the hidden input
			context.fileInputRef()?.click();
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		if (e.defaultPrevented) {
			return;
		}
		if (e.key !== "Enter" && e.key !== " ") {
			return;
		}
		// open the file dialog if user presses space and enter key
		context.fileInputRef()?.click();
	};

	const onDragOver: JSX.EventHandlerUnion<HTMLElement, DragEvent> = (e) => {
		if (!context.allowDragAndDrop || context.disabled()) {
			return;
		}
		e.preventDefault();

		try {
			if (e.dataTransfer) {
				e.dataTransfer.dropEffect = "copy";
			}
		} catch {}
		const isFilesEvent = isDragEventWithFiles(e);
		if ((e.dataTransfer?.items ?? []).length > 0) {
			setIsDragging(true);
		}
	};

	const onDragLeave: JSX.EventHandlerUnion<HTMLElement, DragEvent> = (e) => {
		if (!context.allowDragAndDrop || context.disabled()) {
			return;
		}
		setIsDragging(false);
	};

	const onDrop: JSX.EventHandlerUnion<HTMLElement, DragEvent> = (e) => {
		if (context.allowDragAndDrop()) {
			e.preventDefault();
			e.stopPropagation();
		}

		const isFilesEvent = isDragEventWithFiles(e);
		if (context.disabled() || !isFilesEvent) {
			return;
		}
		const files = e.dataTransfer?.files;
		const fileList = Array.from(files ?? []);
		context.processFiles(fileList);
	};

	return (
		<Polymorphic<FileUploadDropZoneRenderProps>
			as="div"
			aria-label="dropzone"
			role="button"
			tabindex="0"
			aria-disabled={context.disabled()}
			data-dragging={isDragging()}
			ref={mergeRefs(context.setDropzoneRef, local.ref)}
			onClick={composeEventHandlers([local.onClick, onClick])}
			onKeyDown={composeEventHandlers([local.onKeyDown, onKeyDown])}
			onDragOver={composeEventHandlers([local.onDragOver, onDragOver])}
			onDragLeave={composeEventHandlers([local.onDragLeave, onDragLeave])}
			onDrop={composeEventHandlers([local.onDrop, onDrop])}
			{...others}
		/>
	);
}
