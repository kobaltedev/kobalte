import type { JSX } from "solid-js";
import {
	type SignaturePadContextValue,
	useSignaturePadContext,
} from "./signature-pad-provider";

export type FileUploadContextProps = {
	children: (context: SignaturePadContextValue) => JSX.Element;
};

export const FileUploadContext = (props: FileUploadContextProps) =>
	props.children(useSignaturePadContext());
