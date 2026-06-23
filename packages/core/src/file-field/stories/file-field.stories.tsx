import { For, Show, createSignal } from "solid-js";
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
} from "../index";

const meta = preview.meta({
	title: "Components/FileField",
	tags: ["autodocs"],
});

export default meta;

const triggerClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const dropzoneClass =
	"flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors data-[dragging]:border-blue-500 data-[dragging]:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

/** Basic file picker with a trigger button. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class="flex flex-col gap-2 font-sans w-80">
			<Label class="text-sm font-medium text-slate-700">Attachment</Label>
			<Trigger class={triggerClass}>Choose file</Trigger>
			<HiddenInput />
		</Root>
	),
});

/** Drag-and-drop dropzone with a file list. */
export const WithDropzone = meta.story({
	name: "With Dropzone",
	render: () => (
		<Root class="flex flex-col gap-3 font-sans w-80" multiple maxFiles={5}>
			<Label class="text-sm font-medium text-slate-700">Upload files</Label>
			<Dropzone class={dropzoneClass}>
				<span class="text-2xl">📁</span>
				<span>Drag files here or click to browse</span>
			</Dropzone>
			<HiddenInput />
			<ItemList class="flex flex-col gap-2">
				{(file) => (
					<Item class="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2">
						<div class="flex flex-col min-w-0">
							<ItemName class="text-sm text-slate-800 truncate" />
							<ItemSize class="text-xs text-slate-400" />
						</div>
						<ItemDeleteTrigger class="flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors text-lg leading-none">
							×
						</ItemDeleteTrigger>
					</Item>
				)}
			</ItemList>
		</Root>
	),
});

/** Image preview with thumbnail — only images are shown in the preview. */
export const ImagePreview = meta.story({
	name: "Image Preview",
	render: () => (
		<Root class="flex flex-col gap-3 font-sans w-80" multiple accept="image/*" maxFiles={6}>
			<Label class="text-sm font-medium text-slate-700">Photos</Label>
			<Dropzone class={dropzoneClass}>
				<span class="text-2xl">🖼️</span>
				<span>Drop images here or click to browse</span>
				<span class="text-xs text-slate-400">Accepts image files only</span>
			</Dropzone>
			<HiddenInput />
			<ItemList class="grid grid-cols-3 gap-2">
				{(file) => (
					<Item class="relative rounded-md overflow-hidden border border-slate-200 aspect-square group">
						<ItemPreview type="image/*" class="h-full w-full">
							<ItemPreviewImage class="h-full w-full object-cover" />
						</ItemPreview>
						<div class="absolute inset-x-0 bottom-0 bg-black/50 px-1.5 py-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
							<ItemName class="text-xs text-white truncate" />
							<ItemDeleteTrigger class="text-white/80 hover:text-white text-sm leading-none flex-shrink-0">
								×
							</ItemDeleteTrigger>
						</div>
					</Item>
				)}
			</ItemList>
		</Root>
	),
});

/** Single-file mode — replaces the previous selection. */
export const SingleFile = meta.story({
	name: "Single File",
	render: () => (
		<Root class="flex flex-col gap-2 font-sans w-72" accept=".pdf,.doc,.docx">
			<Label class="text-sm font-medium text-slate-700">Resume</Label>
			<Dropzone class={dropzoneClass} style={{ padding: "1.5rem" }}>
				<span>Drop PDF here or click to browse</span>
			</Dropzone>
			<HiddenInput />
			<ItemList class="flex flex-col gap-1">
				{(file) => (
					<Item class="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
						<ItemName class="text-sm text-slate-800 truncate" />
						<ItemDeleteTrigger class="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none ml-2 flex-shrink-0">
							×
						</ItemDeleteTrigger>
					</Item>
				)}
			</ItemList>
		</Root>
	),
});

/** `disabled` prevents all interaction. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class="flex flex-col gap-2 font-sans w-72" disabled>
			<Label class="text-sm font-medium text-slate-400">Attachment (disabled)</Label>
			<Trigger class={triggerClass}>Choose file</Trigger>
			<HiddenInput />
		</Root>
	),
});

/** `validationState="invalid"` surfaces an error message. */
export const Invalid = meta.story({
	name: "Invalid",
	render: () => (
		<Root class="flex flex-col gap-2 font-sans w-72" validationState="invalid" required>
			<Label class="text-sm font-medium text-slate-700">Contract</Label>
			<Trigger class={triggerClass}>Choose file</Trigger>
			<Description class="text-xs text-slate-500">PDF or Word document required.</Description>
			<ErrorMessage class="text-xs text-red-600">A file is required.</ErrorMessage>
			<HiddenInput />
		</Root>
	),
});
