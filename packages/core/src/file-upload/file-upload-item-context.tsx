import { type JSX, createContext, useContext } from "solid-js";

export interface FileUploadItemContextValue {
	file: File;
}

export const FileUploadItemContext =
	createContext<FileUploadItemContextValue>();

export function useFileUploadItemContext() {
	const context = useContext(FileUploadItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useFileUploadItemContext` must be used within a `FileUpload.ItemList` component",
		);
	}

	return context;
}
