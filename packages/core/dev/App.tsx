import { For } from "solid-js";
import { FileUpload } from "../src/file-upload";

export default function App() {
	return (
		<section>
			<FileUpload multiple maxFiles={5} onFileAccept={(data) => console.log('data', data)} onFileReject={(data) => console.log('data', data)} onFileChange={(data) => console.log('data', data)}>
				<FileUpload.Label>Upload!</FileUpload.Label>
				<FileUpload.DropZone>Drop your files here...
					<FileUpload.Trigger>Choose files!</FileUpload.Trigger>
				</FileUpload.DropZone>
				<FileUpload.HiddenInput />
				<FileUpload.ItemGroup>
					<FileUpload.Context>
						{(context) => {
							return (
								<For each={context.acceptedFiles}>
									{(file) => (
										<FileUpload.Item file={file}>
											<FileUpload.ItemPreview type="image/*">
												<FileUpload.ItemPreviewImage />
											</FileUpload.ItemPreview>
											<FileUpload.ItemSize />
											<FileUpload.ItemName />
											<FileUpload.ItemDeleteTrigger />
										</FileUpload.Item>
									)}
								</For>
							)
						}}
					</FileUpload.Context>
				</FileUpload.ItemGroup>
			</FileUpload>
		</section>
	);
}
