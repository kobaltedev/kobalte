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
				<FileUpload.Context>
					{(context) => {
						return (
							<For each={context.acceptedFiles}>
								{(file) => (
									<div>{JSON.stringify(file.name)}</div>
								)}
							</For>
						)
					}}
				</FileUpload.Context>
			</FileUpload>
		</section>
	);
}
