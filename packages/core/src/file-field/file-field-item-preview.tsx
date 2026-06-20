import { type JSX, Show, type ValidComponent, omit } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileFieldItemContext } from "./file-field-item-context";

export interface FileFieldItemPreviewOptions {
	type: string;
}

export interface FileFieldItemPreviewCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileFieldItemPreviewRenderProps
	extends FileFieldItemPreviewCommonProps {}

export type FileFieldItemPreviewProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileFieldItemPreviewOptions &
	Partial<FileFieldItemPreviewCommonProps<ElementOf<T>>>;

export function FileFieldItemPreview<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileFieldItemPreviewProps<T>>,
) {
	const { file } = useFileFieldItemContext();

	const others = omit(props as FileFieldItemPreviewProps, "type");

	return (
		<Show when={file.type.match(props.type ?? ".*")}>
			<Polymorphic<FileFieldItemPreviewRenderProps> as="div" {...others} />
		</Show>
	);
}
