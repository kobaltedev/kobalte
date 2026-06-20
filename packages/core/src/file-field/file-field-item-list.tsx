import { For, type JSX, type ValidComponent, omit } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileFieldContext } from "./file-field-context";
import { FileFieldItemContext } from "./file-field-item-context";

export interface FileFieldItemListOptions {
	children: (file: File) => JSX.Element;
}

export interface FileFieldItemListCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileFieldItemListRenderProps
	extends FileFieldItemListCommonProps {
	children: JSX.Element;
}

export type FileFieldItemListProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileFieldItemListOptions &
	Partial<FileFieldItemListCommonProps<ElementOf<T>>>;

export function FileFieldItemList<T extends ValidComponent = "ul">(
	props: PolymorphicProps<T, FileFieldItemListProps<T>>,
) {
	const context = useFileFieldContext();

	const others = omit(props as FileFieldItemListProps, "children");

	return (
		<Polymorphic<FileFieldItemListRenderProps> as="ul" {...others}>
			<For each={context.acceptedFiles}>
				{(file) => (
					<FileFieldItemContext value={{ file }}>
						{props.children(file)}
					</FileFieldItemContext>
				)}
			</For>
		</Polymorphic>
	);
}
