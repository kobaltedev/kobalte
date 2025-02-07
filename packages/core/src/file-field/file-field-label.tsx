import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileFieldContext } from "./file-field-context";

export interface FileFieldLabelOptions {}

export interface FileFieldLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface FileFieldLabelRenderProps extends FileFieldLabelCommonProps {
	for: string;
}

export type FileFieldLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FileFieldLabelOptions & Partial<FileFieldLabelCommonProps<ElementOf<T>>>;

export function FileFieldLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, FileFieldLabelProps<T>>,
) {
	const context = useFileFieldContext();

	return (
		<Polymorphic<FileFieldLabelRenderProps>
			as="label"
			for={context.inputId()}
			{...(props as FileFieldLabelProps)}
		/>
	);
}
