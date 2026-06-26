import { composeEventHandlers } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";
import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
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

	const others = omit(props as FileFieldItemDeleteTriggerProps, "onClick");

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
			onClick={composeEventHandlers([props.onClick, handleDelete])}
			disabled={context.disabled()}
			{...others}
		/>
	);
}
