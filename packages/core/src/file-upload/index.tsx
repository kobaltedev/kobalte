import {
	FileUploadLabel as Label,
	type FileUploadLabelCommonProps,
	type FileUploadLabelRootProps,
} from "./file-upload-label";
import {
	FileUploadHiddenInput as HiddenInput,
	type FileUploadHiddenInputCommonProps,
	type FileUploadHiddenInputRootProps,
} from "./file-upload-hidden-input";
import {
	FileUploadDropZone as DropZone,
	type FileUploadDropZoneCommonProps,
	type FileUploadDropZoneRootProps,
} from "./file-upload-dropzone";
import {
	FileUploadTrigger as Trigger,
	type FileUploadTriggerCommonProps,
	type FileUploadTriggerRootProps,
} from "./file-upload-trigger";
import {
	FileUploadContext as Context,
	type FileUploadContextProps,
} from "./file-upload-context";
import {
	FileUploadItemGroup as ItemGroup,
	type FileUploadItemGroupCommonProps,
	type FileUploadItemGroupRootProps,
} from "./file-upload-item-group";
import {
	FileUploadItem as Item,
	type FileUploadItemOptions,
	type FileUploadItemCommonProps,
	type FileUploadItemRootProps,
} from "./file-upload-item";
import {
	FileUploadItemPreview as ItemPreview,
	type FileUploadItemPreviewOptions,
	type FileUploadItemPreviewCommonProps,
	type FileUploadItemPreviewRootProps,
} from "./file-upload-item-preview";
import {
	FileUploadItemPreviewImage as ItemPreviewImage,
	type FileUploadItemPreviewImageProps,
	type FileUploadItemPreviewImageRootProps,
} from "./file-upload-item-preview-image";
import {
	FileUploadItemSize as ItemSize,
	type FileUploadItemSizeOptions,
	type FileUploadItemSizeCommonProps,
	type FileUploadItemSizeRootProps,
} from "./file-upload-item-size";
import {
	FileUploadItemDeleteTrigger as ItemDeleteTrigger,
	type FileUploadItemDeleteTriggerCommonProps,
	type FileUploadItemDeleteTriggerRootProps,
} from "./file-upload-item-delete-trigger";
import {
	FileUploadItemName as ItemName,
	type FileUploadItemNameCommonProps,
	type FileUploadItemNameRootProps,
} from "./file-upload-item-name";
import {
	FileUpload as Root,
	type FileUploadRootOptions,
	type FileUploadCommonProps,
	type FileUploadRootProps,
} from "./file-upload-root";

import type {
	Accept,
	Details,
	FileRejection,
	FileError
} from './types'

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
