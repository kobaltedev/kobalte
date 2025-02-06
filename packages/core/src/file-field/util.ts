import type { Accept, FileError, FileRejection } from "./types";

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

const isValidFileSize = (
	file: File,
	minSize: number,
	maxSize: number,
): [boolean, FileError | null] => {
	console.log({ fileSize: file.size, minSize, maxSize });
	if (file.size) {
		if (minSize && maxSize) {
			if (file.size > maxSize) {
				return [false, "FILE_TOO_LARGE"];
			}
			if (file.size < minSize) {
				return [false, "FILE_TOO_SMALL"];
			}
		} else if (minSize && file.size < minSize) {
			return [false, "FILE_TOO_SMALL"];
		} else if (maxSize && file.size > maxSize) {
			return [false, "FILE_TOO_LARGE"];
		}
	}
	return [true, null];
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
	return acceptedFilesLength <= maxFiles;
};

export const getFiles = (
	files: File[],
	accept: string | undefined,
	multiple: boolean,
	maxFiles: number,
	minFileSize: number,
	maxFileSize: number,
	validate?: (file: File) => FileError[] | null,
) => {
	const acceptedFiles: File[] = [];
	const rejectedFiles: FileRejection[] = [];

	for (const file of files) {
		const [accepted, acceptError] = isValidFileType(file, accept);
		const [isValidSize, invalidSizeErro] = isValidFileSize(
			file,
			minFileSize,
			maxFileSize,
		);

		// custom validation
		const validateErrors = validate?.(file);
		const valid = validateErrors ? validateErrors.length === 0 : true;

		if (accepted && isValidSize && valid) {
			acceptedFiles.push(file);
		} else {
			const errors = [acceptError, invalidSizeErro];
			if (!valid) {
				errors.push(...(validateErrors ?? []));
			}
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

export const parseAcceptedTypes = (accept: Accept): string | undefined => {
	if (typeof accept === "string") {
		return accept;
	}

	if (Array.isArray(accept)) {
		return accept.join(",");
	}
};
