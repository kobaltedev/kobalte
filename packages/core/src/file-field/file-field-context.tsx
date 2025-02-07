import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";
import type { FileFieldIntlTranslations } from "./file-field.intl";
import type { FileRejection } from "./types";

export interface FileFieldContextValue {
	translations: Accessor<FileFieldIntlTranslations>;
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
}

export const FileFieldContext = createContext<FileFieldContextValue>();

export function useFileFieldContext() {
	const context = useContext(FileFieldContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useFileFieldContext` must be used within a `FileFieldContext.Root` component",
		);
	}

	return context;
}
