import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileFieldItemContext } from "./file-field-item-context";

export interface FileFieldItemNameOptions {}

export interface FileFieldItemNameCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	children: JSX.Element;
}

export interface FileFieldItemNameRenderProps
	extends FileFieldItemNameCommonProps {}

export type FileFieldItemNameProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileFieldItemNameOptions &
	Partial<FileFieldItemNameCommonProps<ElementOf<T>>>;

export function FileFieldItemName<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, FileFieldItemNameProps<T>>,
) {
	const { file } = useFileFieldItemContext();

	return (
		<Polymorphic<FileFieldItemNameRenderProps>
			as="span"
			{...(props as FileFieldItemNameProps)}
		>
			{props.children ?? file.name}
		</Polymorphic>
	);
}
