import type { JSX, ValidComponent } from "solid-js";
import {
	Polymorphic,
	type ElementOf,
	type PolymorphicProps,
} from "../polymorphic";

export type FileUploadItemGroupCommonProps<
	T extends HTMLElement = HTMLElement,
> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type FileUploadItemGroupRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileUploadItemGroupCommonProps<ElementOf<T>>>;

export function FileUploadItemGroup<T extends ValidComponent = "ul">(
	props: PolymorphicProps<T, FileUploadItemGroupRootProps<T>>,
) {
	return (
		<Polymorphic as="ul" class="file-upload__item-group" {...props}>
			{props.children}
		</Polymorphic>
	);
}
