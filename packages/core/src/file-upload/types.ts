export type FileError =
	| "TOO_MANY_FILES"
	| "FILE_INVALID_TYPE"
	| "FILE_TOO_LARGE"
	| "FILE_TOO_SMALL"
	| "FILE_INVALID";

export type FileRejection = {
	file: File;
	errors: FileError[];
};

type Details = {
	acceptedFiles: File[];
	rejectedFiles: FileRejection[];
};

export type FileUploadRootOptions = {
	multiple?: boolean;
	disabled?: boolean;
	accept?: string;
	maxFiles?: number;
	allowDragAndDrop?: boolean;
	onFileAccept?: (files: File[]) => void;
	onFileReject?: (files: FileRejection[]) => void;
	onFileChange?: (details: Details) => void;
	validate?: (file: File) => FileError[] | null;
};
