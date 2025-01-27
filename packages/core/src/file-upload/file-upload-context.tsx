import type { JSX } from "solid-js";
import {
	type FileUploadContextValue,
	useFileUploadContext,
} from "./file-upload-root-provider";

export interface FileUploadContextProps {
	children: (context: FileUploadContextValue) => JSX.Element;
}

export const FileUploadContext = (props: FileUploadContextProps) =>
	props.children(useFileUploadContext());
