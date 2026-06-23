import { type JSX, type ValidComponent } from "@solidjs/web";
import {
	createSignal,
	omit,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { composeEventHandlers, mergeRefs } from "@kobalte/utils";
import { useFileFieldContext } from "./file-field-context";
import { isDragEventWithFiles } from "./util";

export interface FileFieldDropzoneOptions {}

export interface FileFieldDropzoneCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onDragOver: JSX.EventHandlerUnion<T, DragEvent>;
	onDragLeave: JSX.EventHandlerUnion<T, DragEvent>;
	onDrop: JSX.EventHandlerUnion<T, DragEvent>;
}

export interface FileFieldDropzoneRenderProps
	extends FileFieldDropzoneCommonProps {
	"aria-label": "dropzone";
	role: "button";
	tabindex: "0";
	"aria-disabled": "true" | undefined;
	"data-dragging": boolean;
}

export type FileFieldDropzoneProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileFieldDropzoneOptions &
	Partial<FileFieldDropzoneCommonProps<ElementOf<T>>>;

export function FileFieldDropzone<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileFieldDropzoneProps<T>>,
) {
	const [isDragging, setIsDragging] = createSignal(false);
	const context = useFileFieldContext();

	const others = omit(props as FileFieldDropzoneProps, "ref", "onClick", "onKeyDown", "onDragOver", "onDragLeave", "onDrop");

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
		const fileList = Array.from(files ?? []) as File[];
		context.processFiles(fileList);
	};

	return (
		<Polymorphic<FileFieldDropzoneRenderProps>
			as="div"
			aria-label="dropzone"
			role="button"
			tabindex="0"
			aria-disabled={context.disabled() ? "true" : undefined}
			data-dragging={isDragging()}
			ref={mergeRefs((el: HTMLElement) => context.setDropzoneRef(el), props.ref as (el: HTMLElement) => void)}
			onClick={composeEventHandlers([props.onClick, onClick])}
			onKeyDown={composeEventHandlers([props.onKeyDown, onKeyDown])}
			onDragOver={composeEventHandlers([props.onDragOver, onDragOver])}
			onDragLeave={composeEventHandlers([props.onDragLeave, onDragLeave])}
			onDrop={composeEventHandlers([props.onDrop, onDrop])}
			{...others}
		/>
	);
}
