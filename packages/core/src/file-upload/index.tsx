import { FileUploadLabel as Label } from "./file-upload-label";
import { FileUploadHiddenInput as HiddenInput } from "./file-upload-hidden-input";
import { FileUploadDropZone as DropZone } from "./file-upload-dropzone";
import { FileUploadTrigger as Trigger } from "./file-upload-trigger";
import { FileUploadContext as Context } from "./file-upload-context";
import { FileUpload as Root } from "./file-upload-root";

export { Root };

export const FileUpload = Object.assign(Root, {
	Context,
	DropZone,
	HiddenInput,
	Label,
	Trigger,
});
