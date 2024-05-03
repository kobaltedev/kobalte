/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlayTrigger.ts
 */

import { callHandler, mergeRefs } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";

import * as Button from "../button";
import { PolymorphicProps } from "../polymorphic";
import { PopoverDataSet, usePopoverContext } from "./popover-context";

export interface PopoverTriggerOptions {}

export interface PopoverTriggerCommonProps {
	ref: HTMLElement | ((el: HTMLElement) => void);
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
	onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
}

export interface PopoverTriggerRenderProps
	extends PopoverTriggerCommonProps,
		Button.ButtonRootRenderProps,
		PopoverDataSet {
	"aria-haspopup": "dialog";
	"aria-expanded": boolean;
	"aria-controls": string | undefined;
}

export type PopoverTriggerProps = PopoverTriggerOptions &
	Partial<PopoverTriggerCommonProps>;

/**
 * The button that opens the popover.
 */
export function PopoverTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, PopoverTriggerProps>,
) {
	const context = usePopoverContext();

	const [local, others] = splitProps(props as PopoverTriggerProps, [
		"ref",
		"onClick",
		"onPointerDown",
	]);

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerDown);

		// Prevent popover from opening then closing immediately when inside an overlay in safari.
		e.preventDefault();
	};

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick);
		context.toggle();
	};

	return (
		<Button.Root<
			Component<
				Omit<PopoverTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			ref={mergeRefs(context.setTriggerRef, local.ref)}
			aria-haspopup="dialog"
			aria-expanded={context.isOpen()}
			aria-controls={context.isOpen() ? context.contentId() : undefined}
			onPointerDown={onPointerDown}
			onClick={onClick}
			{...context.dataset()}
			{...others}
		/>
	);
}
