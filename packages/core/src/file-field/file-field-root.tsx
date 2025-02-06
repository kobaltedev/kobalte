import { type ParentProps, createSignal, createUniqueId } from "solid-js";

import { mergeDefaultProps } from "@kobalte/utils";
import { createStore, unwrap } from "solid-js/store";
import {
	FileFieldContext,
	type FileFieldContextValue,
} from "./file-field-context";
import {
	FILE_FIELD_INTL_TRANSLATIONS,
	type FileFieldIntlTranslations,
} from "./file-field.intl";
import type { Accept, Details, FileError, FileRejection } from "./types";
import { getFiles, parseAcceptedTypes } from "./util";

export interface FileFieldRootOptions {
	/** The localized strings of the component. */
	translations?: FileFieldIntlTranslations;

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

export interface FileFieldRootProps extends ParentProps<FileFieldRootOptions> {}

export function FileField(props: FileFieldRootProps) {
	const defaultId = `FileField-${createUniqueId()}`;

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
			translations: FILE_FIELD_INTL_TRANSLATIONS,
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

	const context: FileFieldContextValue = {
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
		<FileFieldContext.Provider value={context}>
			{props.children}
		</FileFieldContext.Provider>
	);
}
