import { type ParentProps, createSignal, createUniqueId } from "solid-js";

import { mergeDefaultProps } from "@kobalte/utils";
import { createStore, unwrap } from "solid-js/store";
import {
	FileUploadContext,
	type FileUploadContextValue,
} from "./file-upload-context";
import type { Accept, Details, FileError, FileRejection } from "./types";
import { getFiles, parseAcceptedTypes } from "./util";

export interface FileUploadRootOptions {
	/** The localized strings of the component. */
	translations?: FileUploadIntlTranslations;

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

	id?: string;
}

export interface FileUploadRootProps
	extends ParentProps<FileUploadRootOptions> {}

export function FileUpload(props: FileUploadRootProps) {
	const defaultId = `fileupload-${createUniqueId()}`;

	const [fileInputRef, setFileInputRef] = createSignal<HTMLInputElement>();
	const [dropzoneRef, setDropzoneRef] = createSignal<HTMLElement>();

	const [acceptedFilesState, setAcceptedFilesState] = createStore<File[]>([]);
	const [rejectedFilesState, setRejectedFilesState] = createStore<
		FileRejection[]
	>([]);

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			allowDragAndDrop: true,
			disabled: false,
			multiple: false,
			maxFiles: 1,
			maxFileSize: Number.POSITIVE_INFINITY,
			minFileSize: 0,
			validate: undefined,
			translations: FILE_UPLOAD_INTL_TRANSLATIONS,
		},
		props,
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
			acceptedFiles: unwrap(acceptedFilesState),
			rejectedFiles: unwrap(rejectedFilesState),
		});
	};

	const context: FileUploadContextValue = {
		inputId: () => mergedProps.id,
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
		translations: () => mergedProps.translations,
	};

	return (
		<FileUploadContext.Provider value={context}>
			{props.children}
		</FileUploadContext.Provider>
	);
}
