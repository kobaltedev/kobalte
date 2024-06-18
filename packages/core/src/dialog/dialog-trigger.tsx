/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlayTrigger.ts
 */

import { callHandler, mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";

import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useDialogContext } from "./dialog-context";

export interface DialogTriggerOptions {}

export interface DialogTriggerCommonProps<T extends HTMLElement = HTMLElement>
	extends Button.ButtonRootCommonProps<T> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface DialogTriggerRenderProps
	extends DialogTriggerCommonProps,
		Button.ButtonRootRenderProps {
	"aria-haspopup": "dialog";
	"aria-expanded": boolean;
	"aria-controls": string | undefined;
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export type DialogTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DialogTriggerOptions & Partial<DialogTriggerCommonProps<ElementOf<T>>>;

/**
 * The button that opens the dialog.
 */
export function DialogTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, DialogTriggerProps<T>>,
) {
	const context = useDialogContext();

	const [local, others] = splitProps(props as DialogTriggerProps, [
		"ref",
		"onClick",
	]);

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick);
		context.toggle();
	};

	return (
		<Button.Root<
			Component<
				Omit<DialogTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			ref={mergeRefs(context.setTriggerRef, local.ref)}
			aria-haspopup="dialog"
			aria-expanded={context.isOpen()}
			aria-controls={context.isOpen() ? context.contentId() : undefined}
			data-expanded={context.isOpen() ? "" : undefined}
			data-closed={!context.isOpen() ? "" : undefined}
			onClick={onClick}
			{...others}
		/>
	);
}
