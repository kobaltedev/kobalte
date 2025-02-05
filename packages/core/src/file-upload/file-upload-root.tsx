import {
	type JSX,
	type ValidComponent,
	createSignal,
	createUniqueId,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { mergeDefaultProps } from "@kobalte/utils";
import { createStore } from "solid-js/store";
import {
	FileUploadContext,
	type FileUploadContextValue,
} from "./file-upload-context";
import type { FileRejection } from "./types";
import { getFiles, parseAcceptedTypes } from "./util";

export type FileUploadRootOptions = {
	multiple?: boolean;
	disabled?: boolean;
	accept?: Accept;
	maxFiles?: number;
	allowDragAndDrop?: boolean;
	maxFileSize?: number;
	minFileSize?: number;
	onFileAccept?: (files: File[]) => void;
	onFileReject?: (files: FileRejection[]) => void;
	onFileChange?: (details: Details) => void;
	validate?: (file: File) => FileError[] | null;
};

export interface FileUploadCommonProps<T extends HTMLElement = HTMLElement> {
	id?: string;
	style?: JSX.CSSProperties | string;
}

export type FileUploadRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileUploadRootOptions & Partial<FileUploadCommonProps<ElementOf<T>>>;

export function FileUpload<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileUploadRootProps<T>>,
) {
	const inputId = createUniqueId();
	const [fileInputRef, setFileInputRef] = createSignal<HTMLInputElement>();
	const [dropzoneRef, setDropzoneRef] = createSignal<HTMLElement>();

	const [acceptedFilesState, setAcceptedFilesState] = createStore<File[]>([]);
	const [rejectedFilesState, setRejectedFilesState] = createStore<
		FileRejection[]
	>([]);

	const mergedProps = mergeDefaultProps(
		{
			allowDragAndDrop: true,
			disabled: false,
			multiple: false,
			maxFiles: 1,
			maxFileSize: Number.POSITIVE_INFINITY,
			minFileSize: 0,
			validate: undefined,
		},
		props as FileUploadRootProps<T>,
	);

	const processFiles = (files: File[]) => {
		const { acceptedFiles, rejectedFiles } = getFiles(
			files,
			parseAcceptedTypes(mergedProps.accept),
			mergedProps.multiple ?? false,
			mergedProps.maxFiles ?? 1,
			mergedProps.minFileSize,
			mergedProps.maxFileSize,
			mergedProps.validate,
		);

		if (mergedProps.multiple) {
			setAcceptedFilesState((prevAcceptedFiles) => [
				...prevAcceptedFiles,
				...acceptedFiles,
			]);
			setRejectedFilesState(rejectedFiles);
		} else {
			if (acceptedFiles.length > 0 && acceptedFiles.length === 1) {
				setAcceptedFilesState([acceptedFiles[0]]);
				setRejectedFilesState(rejectedFiles);
			} else if (rejectedFiles.length > 0 && rejectedFiles.length === 1) {
				setRejectedFilesState(rejectedFiles);
			}
		}

		// trigger on file accept
		mergedProps.onFileAccept?.(acceptedFiles);

		// trigger on file reject
		if (rejectedFiles.length > 0) {
			mergedProps.onFileReject?.(rejectedFiles);
		}

		// trigger on change
		mergedProps.onFileChange?.({ acceptedFiles, rejectedFiles });
	};

	const removeFile = (file: File) => {
		setAcceptedFilesState((prevAcceptedFiles) =>
			prevAcceptedFiles.filter((f) => f !== file),
		);
		// trigger on change
		mergedProps.onFileChange?.({
			acceptedFiles: acceptedFilesState.map((f) => f),
			rejectedFiles: rejectedFilesState.map((f) => f),
		});
	};

	const context: FileUploadContextValue = {
		inputId: () => inputId,
		fileInputRef,
		setFileInputRef,
		dropzoneRef,
		setDropzoneRef,
		disabled: () => mergedProps.disabled,
		multiple: () => mergedProps.multiple,
		accept: () => parseAcceptedTypes(mergedProps.accept),
		allowDragAndDrop: () => mergedProps.allowDragAndDrop,
		processFiles,
		acceptedFiles: acceptedFilesState,
		rejectedFiles: rejectedFilesState,
		removeFile,
	};

	return (
		<FileUploadContext.Provider value={context}>
			<Polymorphic as="div" {...props}>
				{props.children}
			</Polymorphic>
		</FileUploadContext.Provider>
	);
}
