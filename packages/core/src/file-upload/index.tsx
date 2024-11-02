import {
	FileUploadContext as Context,
	type FileUploadContextProps,
} from "./file-upload-context";
import {
	FileUploadDropZone as DropZone,
	type FileUploadDropZoneCommonProps,
	type FileUploadDropZoneRootProps,
} from "./file-upload-dropzone";
import {
	type FileUploadHiddenInputCommonProps,
	type FileUploadHiddenInputRootProps,
	FileUploadHiddenInput as HiddenInput,
} from "./file-upload-hidden-input";
import {
	type FileUploadItemCommonProps,
	type FileUploadItemOptions,
	type FileUploadItemRootProps,
	FileUploadItem as Item,
} from "./file-upload-item";
import {
	type FileUploadItemDeleteTriggerCommonProps,
	type FileUploadItemDeleteTriggerRootProps,
	FileUploadItemDeleteTrigger as ItemDeleteTrigger,
} from "./file-upload-item-delete-trigger";
import {
	type FileUploadItemGroupCommonProps,
	type FileUploadItemGroupRootProps,
	FileUploadItemGroup as ItemGroup,
} from "./file-upload-item-group";
import {
	type FileUploadItemNameCommonProps,
	type FileUploadItemNameRootProps,
	FileUploadItemName as ItemName,
} from "./file-upload-item-name";
import {
	type FileUploadItemPreviewCommonProps,
	type FileUploadItemPreviewOptions,
	type FileUploadItemPreviewRootProps,
	FileUploadItemPreview as ItemPreview,
} from "./file-upload-item-preview";
import {
	type FileUploadItemPreviewImageProps,
	type FileUploadItemPreviewImageRootProps,
	FileUploadItemPreviewImage as ItemPreviewImage,
} from "./file-upload-item-preview-image";
import {
	type FileUploadItemSizeCommonProps,
	type FileUploadItemSizeOptions,
	type FileUploadItemSizeRootProps,
	FileUploadItemSize as ItemSize,
} from "./file-upload-item-size";
import {
	type FileUploadLabelCommonProps,
	type FileUploadLabelRootProps,
	FileUploadLabel as Label,
} from "./file-upload-label";
import {
	type FileUploadCommonProps,
	type FileUploadRootOptions,
	type FileUploadRootProps,
	FileUpload as Root,
} from "./file-upload-root";
import {
	type FileUploadTriggerCommonProps,
	type FileUploadTriggerOptions,
	type FileUploadTriggerRenderProps,
	type FileUploadTriggerRootProps,
	FileUploadTrigger as Trigger,
} from "./file-upload-trigger";

import type { Accept, Details, FileError, FileRejection } from "./types";

export type {
	Accept,
	Details,
	FileRejection,
	FileError,
	FileUploadLabelCommonProps,
	FileUploadLabelRootProps,
	FileUploadHiddenInputCommonProps,
	FileUploadHiddenInputRootProps,
	FileUploadDropZoneCommonProps,
	FileUploadDropZoneRootProps,
	FileUploadTriggerCommonProps,
	FileUploadTriggerRootProps,
	FileUploadContextProps,
	FileUploadItemGroupCommonProps,
	FileUploadItemGroupRootProps,
	FileUploadItemOptions,
	FileUploadItemCommonProps,
	FileUploadItemRootProps,
	FileUploadItemPreviewOptions,
	FileUploadItemPreviewCommonProps,
	FileUploadItemPreviewRootProps,
	FileUploadItemPreviewImageProps,
	FileUploadItemPreviewImageRootProps,
	FileUploadItemSizeOptions,
	FileUploadItemSizeCommonProps,
	FileUploadItemSizeRootProps,
	FileUploadItemDeleteTriggerCommonProps,
	FileUploadItemDeleteTriggerRootProps,
	FileUploadItemNameCommonProps,
	FileUploadItemNameRootProps,
	FileUploadRootOptions,
	FileUploadCommonProps,
	FileUploadRootProps,
	FileUploadTriggerOptions,
	FileUploadTriggerRenderProps,
};

export {
	Root,
	Context,
	DropZone,
	HiddenInput,
	Label,
	Trigger,
	ItemGroup,
	Item,
	ItemPreview,
	ItemPreviewImage,
	ItemSize,
	ItemDeleteTrigger,
	ItemName,
};

export const FileUpload = Object.assign(Root, {
	Context,
	DropZone,
	HiddenInput,
	Label,
	Trigger,
	ItemGroup,
	Item,
	ItemPreview,
	ItemPreviewImage,
	ItemSize,
	ItemDeleteTrigger,
	ItemName,
});
