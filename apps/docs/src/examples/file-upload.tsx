import { FileUpload } from "@kobalte/core/file-upload";
import { For } from "solid-js";

import style from "./file-upload.module.css";

export function BasicExample() {
	return (
		<FileUpload
			class={style.fileUpload}
			multiple
			maxFiles={5}
			onFileAccept={(data) => console.log("data", data)}
			onFileReject={(data) => console.log("data", data)}
			onFileChange={(data) => console.log("data", data)}
		>
			<FileUpload.Label class={style.fileUpload__label}>
				File Upload
			</FileUpload.Label>
			<FileUpload.DropZone class={style.fileUpload__dropzone}>
				Drop your files here...
				<FileUpload.Trigger class={style.fileUpload__trigger}>
					Choose files!
				</FileUpload.Trigger>
			</FileUpload.DropZone>
			<FileUpload.HiddenInput />
			<FileUpload.ItemGroup class={style.fileUpload__itemGroup}>
				<FileUpload.Context>
					{(context) => {
						return (
							<For each={context.acceptedFiles}>
								{(file) => (
									<FileUpload.Item file={file} class={style.fileUpload__item}>
										<FileUpload.ItemPreview
											type="image/*"
											class={style.fileUpload__itemPreview}
										>
											<FileUpload.ItemPreviewImage
												class={style.fileUpload__itemPreviewImage}
											/>
										</FileUpload.ItemPreview>
										<FileUpload.ItemName class={style.fileUpload__itemName} />
										<FileUpload.ItemSize class={style.fileUpload__itemSize} />
										<FileUpload.ItemDeleteTrigger
											class={style.fileUpload__itemDeleteTrigger}
										>
											Delete
										</FileUpload.ItemDeleteTrigger>
									</FileUpload.Item>
								)}
							</For>
						);
					}}
				</FileUpload.Context>
			</FileUpload.ItemGroup>
		</FileUpload>
	);
}
