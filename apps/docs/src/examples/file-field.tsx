import { FileField } from "@kobalte/core/file-field";

import style from "./file-field.module.css";

export function BasicExample() {
	return (
		<FileField
			class={style.FileField}
			multiple
			maxFiles={5}
			onFileAccept={(data) => console.log("data", data)}
			onFileReject={(data) => console.log("data", data)}
			onFileChange={(data) => console.log("data", data)}
		>
			<FileField.Label class={style.FileField__label}>
				File Upload
			</FileField.Label>
			<FileField.Dropzone class={style.FileField__dropzone}>
				Drop your files here...
				<FileField.Trigger class={style.FileField__trigger}>
					Choose files!
				</FileField.Trigger>
			</FileField.Dropzone>
			<FileField.HiddenInput />
			<FileField.ItemList class={style.FileField__itemGroup}>
				{(file) => (
					<FileField.Item class={style.FileField__item}>
						<FileField.ItemPreviewImage
							class={style.FileField__itemPreviewImage}
						/>
						<FileField.ItemName class={style.FileField__itemName} />
						<FileField.ItemSize class={style.FileField__itemSize} />
						<FileField.ItemDeleteTrigger
							class={style.FileField__itemDeleteTrigger}
						>
							Delete
						</FileField.ItemDeleteTrigger>
					</FileField.Item>
				)}
			</FileField.ItemList>
		</FileField>
	);
}

export function HTMLFormExample() {
	let formRef: HTMLFormElement | undefined;

	const onSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		event.stopPropagation();

		const formData = new FormData(formRef);
		const uploadedFiles = formData.getAll("uploaded-files");

		const fileNames = uploadedFiles
			.filter((file): file is File => file instanceof File)
			.map((file) => file.name);

		alert(JSON.stringify(fileNames, null, 2));
	};

	return (
		<form class={style.formContainer} ref={formRef} onSubmit={onSubmit}>
			<FileField
				multiple
				maxFiles={5}
				onFileAccept={(data) => console.log("data", data)}
				onFileReject={(data) => console.log("data", data)}
				onFileChange={(data) => console.log("data", data)}
			>
				<FileField.Label class={style.FileField__label}>
					File Upload
				</FileField.Label>
				<FileField.Dropzone class={style.FileField__dropzone}>
					Drop your files here...
					<FileField.Trigger class={style.FileField__trigger}>
						Choose files!
					</FileField.Trigger>
				</FileField.Dropzone>
				<FileField.HiddenInput name="uploaded-files" />
				<FileField.ItemList class={style.FileField__itemGroup}>
					{(file) => (
						<FileField.Item  class={style.FileField__item}>
							<FileField.ItemPreviewImage
								class={style.FileField__itemPreviewImage}
							/>
							<FileField.ItemName class={style.FileField__itemName} />
							<FileField.ItemSize class={style.FileField__itemSize} />
							<FileField.ItemDeleteTrigger
								class={style.FileField__itemDeleteTrigger}
							>
								Delete
							</FileField.ItemDeleteTrigger>
						</FileField.Item>
					)}
				</FileField.ItemList>
			</FileField>
			<button type="submit" class={style["submit-btn"]}>
				Submit Files
			</button>
		</form>
	);
}
