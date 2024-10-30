import type { FileError, FileRejection } from "./types";

const isFileAccepted = (file: File | null, accept: string | undefined) => {
	if (file && accept) {
		const types = Array.isArray(accept) ? accept : accept.split(",");

		const fileName = file.name || "";
		const mimeType = (file.type || "").toLowerCase();
		const baseMimeType = mimeType.replace(/\/.*$/, "");

		return types.some((type) => {
			const validType = type.trim().toLowerCase();

			if (validType.charAt(0) === ".") {
				return fileName.toLowerCase().endsWith(validType);
			}

			if (validType.endsWith("/*")) {
				return baseMimeType === validType.replace(/\/.*$/, "");
			}

			return mimeType === validType;
		});
	}
	return true;
};

const isValidFileType = (
	file: File,
	accept: string | undefined,
): [boolean, FileError | null] => {
	const isAcceptable =
		file.type === "application/x-moz-file" || isFileAccepted(file, accept);
	return [isAcceptable, isAcceptable ? null : "FILE_INVALID_TYPE"];
};

export const isFilesWithinMaxRange = (
	acceptedFilesLength: number,
	multiple: boolean,
	maxFiles: number,
) => {
	if (!multiple && acceptedFilesLength > 1) {
		return false;
	}
	if (acceptedFilesLength > maxFiles) {
		return false;
	}
	return true;
};

export const getFiles = (
	files: File[],
	accept: string | undefined,
	multiple: boolean,
	maxFiles: number,
	validate?: (file: File) => FileError[] | null,
) => {
	const acceptedFiles: File[] = [];
	const rejectedFiles: FileRejection[] = [];

	for (const file of files) {
		const [accepted, acceptError] = isValidFileType(file, accept);
		const validateErrors = validate?.(file);
		const valid = validateErrors ? validateErrors.length === 0 : true;

		if (accepted && valid) {
			acceptedFiles.push(file);
		} else {
			const errors = [acceptError];
			if (!valid) errors.push(...(validateErrors ?? []));
			rejectedFiles.push({
				file,
				errors: errors.filter(Boolean) as FileError[],
			});
		}
	}

	// if files are not within max files range, push them onto rejected list
	if (!isFilesWithinMaxRange(acceptedFiles.length, !!multiple, maxFiles)) {
		for (const file of acceptedFiles) {
			rejectedFiles.push({ file, errors: ["TOO_MANY_FILES"] });
		}
		acceptedFiles.splice(0);
	}

	return {
		acceptedFiles,
		rejectedFiles,
	};
};

export const isDragEventWithFiles = (event: DragEvent) => {
	if (!event.dataTransfer) {
		return !!event.target && "files" in event.target;
	}
	return event.dataTransfer.types.some((type) => {
		return type === "Files" || type === "application/x-moz-file";
	});
};
