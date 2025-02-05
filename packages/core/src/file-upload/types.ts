export type FileError =
	| "TOO_MANY_FILES"
	| "FILE_INVALID_TYPE"
	| "FILE_TOO_LARGE"
	| "FILE_TOO_SMALL";

export type FileRejection = {
	file: File;
	errors: FileError[];
};

export type Details = {
	acceptedFiles: File[];
	rejectedFiles: FileRejection[];
};

export type Accept = string | string[] | undefined;
