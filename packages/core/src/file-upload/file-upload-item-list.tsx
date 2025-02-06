import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface FileUploadItemListOptions {}

export interface FileUploadItemListCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	children?: (file: File) => JSX.Element;
}

export interface FileUploadItemListRenderProps
	extends FileUploadItemListCommonProps {}

export type FileUploadItemListRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadItemListCommonProps<ElementOf<T>>>;

export function FileUploadItemList<T extends ValidComponent = "ul">(
	props: PolymorphicProps<T, FileUploadItemListRootProps<T>>,
) {
	const [local, others] = splitProps(props as FileUploadTriggerRootProps, [
		"children",
	]);

	return (
		<Polymorphic<FileUploadItemListRenderProps> as="ul" {...others}>
			<For each={context.acceptedFiles}>
				{(file) => (
					<FileUploadItemContext.Provider value={{ file }}>
						{local.children(file)}
					</FileUploadItemContext.Provider>
				)}
			</For>
		</Polymorphic>
	);
}
