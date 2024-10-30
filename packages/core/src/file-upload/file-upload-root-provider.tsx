import { createContext, createUniqueId, type JSX, useContext } from "solid-js";

import type { FileRejection, FileUploadRootOptions } from "./types";
import { createStore } from "solid-js/store";
import { getFiles } from "./util";

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
	acceptedFiles: File[],
	rejectedFiles: FileRejection[],
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

	const processFiles = (files: File[]) => {
		const { acceptedFiles, rejectedFiles } = getFiles(
			files,
			props.accept,
			props.multiple ?? false,
			props.maxFiles ?? 1,
			props.validate,
		);

		if (props.multiple) {
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
		props.onFileAccept?.(acceptedFiles);

		// trigger on file reject
		if (rejectedFiles.length > 0) {
			props.onFileReject?.(rejectedFiles);
		}

		// trigger on change
		props.onFileChange?.({ acceptedFiles, rejectedFiles });
	};

	const value = {
		inputId: inputId,
		fileInputRef: fileInputRef,
		dropzoneRef: dropzoneRef,
		disabled: props.disabled ?? false,
		multiple: props.multiple ?? false,
		accept: props.accept,
		allowDragAndDrop: props.allowDragAndDrop ?? true,
		processFiles,
		acceptedFiles: acceptedFilesState,
		rejectedFiles: rejectedFilesState,
	};

	return (
		<FileUploadContext.Provider value={value}>
			{props.children}
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
