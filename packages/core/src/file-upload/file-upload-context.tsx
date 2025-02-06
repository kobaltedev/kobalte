import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";
import type { FileRejection } from "./types";

export type FileUploadContextValue = {
	translations: Accessor<FileUploadIntlTranslations>;
	inputId: Accessor<string>;
	fileInputRef: Accessor<HTMLInputElement | undefined>;
	setFileInputRef: Setter<HTMLInputElement | undefined>;
	dropzoneRef: Accessor<HTMLElement | undefined>;
	setDropzoneRef: Setter<HTMLElement | undefined>;
	disabled: Accessor<boolean | undefined>;
	multiple: Accessor<boolean | undefined>;
	accept: Accessor<string | undefined>;
	allowDragAndDrop: Accessor<boolean | undefined>;
	processFiles: (files: File[]) => void;
	acceptedFiles: File[]; // store
	rejectedFiles: FileRejection[]; // store
	removeFile: (file: File) => void;
};

export const FileUploadContext = createContext<FileUploadContextValue>();

export function useFileUploadContext() {
	const context = useContext(FileUploadContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useFileUploadContext` must be used within a `FileUploadContext.Root` component",
		);
	}

	return context;
}
