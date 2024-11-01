import { FileTrigger } from "../../../../packages/core/src/file-trigger";
import style from "./file-trigger.module.css";

export function BasicExample() {
	return (
		<FileTrigger>
			<FileTrigger.Button class={style["file-trigger__button"]}>Upload</FileTrigger.Button>
			<FileTrigger.Input />
		</FileTrigger>
	);
}

export function AcceptedFileTypesExample() {
	return (
		<FileTrigger>
			<FileTrigger.Button class={style["file-trigger__button"]}>Select files</FileTrigger.Button>
			<FileTrigger.Input acceptedFileTypes={["image/png"]} />
		</FileTrigger>
	);
}

export function MultipleFilesExample() {
	return (
		<FileTrigger>
			<FileTrigger.Button class={style["file-trigger__button"]}>Upload your files</FileTrigger.Button>
			<FileTrigger.Input allowsMultiple />
		</FileTrigger>
	);
}

export function DirectorySelectionExample() {
	return (
		<FileTrigger>
			<FileTrigger.Button class={style["file-trigger__button"]}>Upload</FileTrigger.Button>
			<FileTrigger.Input acceptDirectory />
		</FileTrigger>
	);
}

export function MediaCaptureExample() {
	return (
		<FileTrigger>
			<FileTrigger.Button class={style["file-trigger__button"]}>Open Camera</FileTrigger.Button>
			<FileTrigger.Input defaultCamera="environment" />
		</FileTrigger>
	);
}
