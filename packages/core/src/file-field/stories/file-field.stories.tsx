import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	Dropzone,
	ErrorMessage,
	HiddenInput,
	Item,
	ItemDeleteTrigger,
	ItemList,
	ItemName,
	ItemPreview,
	ItemPreviewImage,
	ItemSize,
	Label,
	Root,
	Trigger,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/FileField",
	tags: ["autodocs"],
});

export default meta;

export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.fileFieldRoot}>
			<Label class={style.fileFieldLabel}>Attachment</Label>
			<Trigger class={style.fileFieldTrigger}>Choose file</Trigger>
			<HiddenInput />
		</Root>
	),
});

export const WithDropzone = meta.story({
	name: "With Dropzone",
	render: () => (
		<Root class={style.fileFieldRoot} multiple maxFiles={5}>
			<Label class={style.fileFieldLabel}>Upload files</Label>
			<Dropzone class={style.fileFieldDropzone}>
				<span class={style.fileFieldDropzoneIcon}>📁</span>
				<span>Drag files here or click to browse</span>
			</Dropzone>
			<HiddenInput />
			<ItemList class={style.fileFieldItemList}>
				{(_file) => (
					<Item class={style.fileFieldItem}>
						<div class={style.fileFieldItemContent}>
							<ItemName class={style.fileFieldItemName} />
							<ItemSize class={style.fileFieldItemSize} />
						</div>
						<ItemDeleteTrigger class={style.fileFieldItemDelete}>
							×
						</ItemDeleteTrigger>
					</Item>
				)}
			</ItemList>
		</Root>
	),
});

export const ImagePreview = meta.story({
	name: "Image Preview",
	render: () => (
		<Root class={style.fileFieldRoot} multiple accept="image/*" maxFiles={6}>
			<Label class={style.fileFieldLabel}>Photos</Label>
			<Dropzone class={style.fileFieldDropzone}>
				<span class={style.fileFieldDropzoneIcon}>🖼️</span>
				<span>Drop images here or click to browse</span>
				<span class={style.fileFieldDropzoneHint}>
					Accepts image files only
				</span>
			</Dropzone>
			<HiddenInput />
			<ItemList class={[style.fileFieldItemList, style.fileFieldItemListGrid]}>
				{(_file) => (
					<Item class={style.fileFieldItemImage}>
						<ItemPreview type="image/*" class={style.fileFieldItemPreview}>
							<ItemPreviewImage class={style.fileFieldItemPreviewImage} />
						</ItemPreview>
						<div class={style.fileFieldItemImageOverlay}>
							<ItemName class={style.fileFieldItemImageName} />
							<ItemDeleteTrigger class={style.fileFieldItemImageDelete}>
								×
							</ItemDeleteTrigger>
						</div>
					</Item>
				)}
			</ItemList>
		</Root>
	),
});

export const SingleFile = meta.story({
	name: "Single File",
	render: () => (
		<Root
			class={[style.fileFieldRoot, style.fileFieldRootW72]}
			accept=".pdf,.doc,.docx"
		>
			<Label class={style.fileFieldLabel}>Resume</Label>
			<Dropzone class={style.fileFieldDropzone}>
				<span>Drop PDF here or click to browse</span>
			</Dropzone>
			<HiddenInput />
			<ItemList class={[style.fileFieldItemList, style.fileFieldItemListGapSm]}>
				{(_file) => (
					<Item class={style.fileFieldItem}>
						<ItemName class={style.fileFieldItemName} />
						<ItemDeleteTrigger class={style.fileFieldItemDelete}>
							×
						</ItemDeleteTrigger>
					</Item>
				)}
			</ItemList>
		</Root>
	),
});

export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={[style.fileFieldRoot, style.fileFieldRootW72]} disabled>
			<Label class={[style.fileFieldLabel, style.fileFieldLabelDisabled]}>
				Attachment (disabled)
			</Label>
			<Trigger class={style.fileFieldTrigger}>Choose file</Trigger>
			<HiddenInput />
		</Root>
	),
});

export const Invalid = meta.story({
	name: "Invalid",
	render: () => (
		<Root
			class={[style.fileFieldRoot, style.fileFieldRootW72]}
			validationState="invalid"
			required
		>
			<Label class={style.fileFieldLabel}>Contract</Label>
			<Trigger class={style.fileFieldTrigger}>Choose file</Trigger>
			<Description class={style.fileFieldDescription}>
				PDF or Word document required.
			</Description>
			<ErrorMessage class={style.fileFieldError}>
				A file is required.
			</ErrorMessage>
			<HiddenInput />
		</Root>
	),
});
