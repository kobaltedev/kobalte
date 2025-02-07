import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface FileFieldItemOptions {}

export interface FileFieldItemCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileFieldItemRenderProps extends FileFieldItemCommonProps {}

export type FileFieldItemRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileFieldItemOptions & Partial<FileFieldItemCommonProps<ElementOf<T>>>;

// TODO: replace with List
export function FileFieldItem<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, FileFieldItemRootProps<T>>,
) {
	return (
		<Polymorphic<FileFieldItemRenderProps>
			as="li"
			{...(props as FileFieldItemRootProps)}
		/>
	);
}
