import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";

import type { ElementOf, PolymorphicProps } from "../polymorphic";

import { composeEventHandlers } from "@kobalte/utils";
import * as Button from "../button";
import { useFileFieldContext } from "./file-field-context";
import { useFileFieldItemContext } from "./file-field-item-context";

export interface FileFieldItemDeleteTriggerOptions {}

export interface FileFieldItemDeleteTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface FileFieldItemDeleteTriggerRenderProps
	extends FileFieldItemDeleteTriggerCommonProps,
		Button.ButtonRootRenderProps {
	disabled: boolean | undefined;
}

export type FileFieldItemDeleteTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<FileFieldItemDeleteTriggerCommonProps<ElementOf<T>>>;

export function FileFieldItemDeleteTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, FileFieldItemDeleteTriggerProps<T>>,
) {
	const context = useFileFieldContext();
	const { file } = useFileFieldItemContext();

	const [local, others] = splitProps(props as FileFieldItemDeleteTriggerProps, [
		"onClick",
	]);

	const handleDelete = () => {
		context.removeFile(file);
	};

	return (
		<Button.Root<
			Component<
				Omit<
					FileFieldItemDeleteTriggerRenderProps,
					keyof Button.ButtonRootRenderProps
				>
			>
		>
			onClick={composeEventHandlers([local.onClick, handleDelete])}
			disabled={context.disabled()}
			{...others}
		/>
	);
}
