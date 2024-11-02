import { type JSX, createContext, createUniqueId, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { mergeDefaultProps } from "@kobalte/utils";

import { getFiles, parseAcceptedTypes } from "./util";

import type { FileRejection, FileUploadRootOptions } from "./types";

type FileUploadContextProviderProps = FileUploadRootOptions & {
	children: JSX.Element;
};

export type FileUploadContextValue = {
	inputId: string;
	fileInputRef: HTMLInputElement | undefined;
	dropzoneRef: HTMLElement | undefined;
	disabled?: boolean;
	multiple?: boolean;
	accept?: string;
	allowDragAndDrop?: boolean;
	processFiles: (files: File[]) => void;
	acceptedFiles: File[];
	rejectedFiles: FileRejection[];
	removeFile: (file: File) => void;
};

export const FileUploadContext = createContext<FileUploadContextValue>();

export const FileUploadProvider = (props: FileUploadContextProviderProps) => {
	const inputId = createUniqueId();
	const fileInputRef: HTMLInputElement | undefined = undefined;
	const dropzoneRef: HTMLElement | undefined = undefined;

	const [acceptedFilesState, setAcceptedFilesState] = createStore<File[]>([]);
	const [rejectedFilesState, setRejectedFilesState] = createStore<
		FileRejection[]
	>([]);

	const mergedProps = mergeDefaultProps(
		{
			accept: parseAcceptedTypes(props.accept),
			allowDragAndDrop: true,
			disabled: false,
			multiple: false,
			maxFiles: 1,
			maxFileSize: Number.POSITIVE_INFINITY,
			minFileSize: 0,
			validate: undefined,
		},
		props,
	);

	const processFiles = (files: File[]) => {
		const { acceptedFiles, rejectedFiles } = getFiles(
			files,
			mergedProps.accept,
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

	const value = {
		inputId: inputId,
		fileInputRef: fileInputRef,
		dropzoneRef: dropzoneRef,
		disabled: mergedProps.disabled,
		multiple: mergedProps.multiple,
		accept: mergedProps.accept,
		allowDragAndDrop: mergedProps.allowDragAndDrop,
		processFiles,
		acceptedFiles: acceptedFilesState,
		rejectedFiles: rejectedFilesState,
		removeFile,
	};

	return (
		<FileUploadContext.Provider value={value}>
			{mergedProps.children}
		</FileUploadContext.Provider>
	);
};

export function useFileUploadContext() {
	const context = useContext(FileUploadContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useFileUploadContext` must be used within a `FileUploadContext.Root` component",
		);
	}

	return context;
}
