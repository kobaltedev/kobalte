import { type Component, type JSX, type ValidComponent, splitProps } from "solid-js";

import { callHandler } from "@kobalte/utils";
import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useFileTriggerContext } from "./file-trigger-context";

export interface FileTriggerButtonOptions extends Button.ButtonRootOptions {}

export interface FileTriggerButtonCommonProps<T extends HTMLElement = HTMLElement> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface FileTriggerButtonRenderProps
	extends FileTriggerButtonCommonProps,
		Button.ButtonRootRenderProps {}

export type FileTriggerButtonProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	FileTriggerButtonOptions & Partial<FileTriggerButtonCommonProps<ElementOf<T>>>;

export function FileTriggerButton<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, FileTriggerButtonProps<T>>,
) {
	const context = useFileTriggerContext();

	const [local, others] = splitProps(props, ["onClick"]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
		callHandler(e, local.onClick);
		context.inputRef()?.click();
	};

	return (
		<Button.Root<Component<Omit<FileTriggerButtonRenderProps, keyof Button.ButtonRootRenderProps>>>
			onClick={onClick}
			{...others}
		/>
	);
}
