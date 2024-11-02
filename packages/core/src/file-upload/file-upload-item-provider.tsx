import { type JSX, createContext, useContext } from "solid-js";

type FileUploadItemContextProviderProps = {
	children: JSX.Element;
	file: File;
};

export const FileUploadItemContext = createContext<{ file: File }>();

export const FileUploadItemProvider = (
	props: FileUploadItemContextProviderProps,
) => {
	return (
		<FileUploadItemContext.Provider value={{ file: props.file }}>
			{props.children}
		</FileUploadItemContext.Provider>
	);
};

export function useFileUploadItemContext() {
	const context = useContext(FileUploadItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useFileUploadItemContext` must be used within a `FileUploadItemContext.Root` component",
		);
	}

	return context;
}
