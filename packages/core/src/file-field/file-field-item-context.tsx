import { createContext, useContext } from "solid-js";
import type { UploadFile } from "@solid-primitives/upload";

export interface FileFieldItemContextValue {
	file: UploadFile;
}

export const FileFieldItemContext = createContext<FileFieldItemContextValue>();

export function useFileFieldItemContext() {
	const context = useContext(FileFieldItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useFileFieldItemContext` must be used within a `FileField.ItemList` component",
		);
	}

	return context;
}
