/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard-anchor.ts
 */

import { callHandler, mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	onCleanup,
	splitProps,
} from "solid-js";

import * as Link from "../link";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	type HoverCardDataSet,
	useHoverCardContext,
} from "./hover-card-context";

export interface HoverCardTriggerOptions {}

export interface HoverCardTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	disabled: boolean;
	ref: T | ((el: T) => void);
	onPointerEnter: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface HoverCardTriggerRenderProps
	extends HoverCardTriggerCommonProps,
		Link.LinkRootRenderProps,
		HoverCardDataSet {}

export type HoverCardTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = HoverCardTriggerOptions &
	Partial<HoverCardTriggerCommonProps<ElementOf<T>>>;

/**
 * The link that opens the hovercard when hovered.
 */
export function HoverCardTrigger<T extends ValidComponent = "a">(
	props: PolymorphicProps<T, HoverCardTriggerProps<T>>,
) {
	const context = useHoverCardContext();

	const [local, others] = splitProps(props as HoverCardTriggerProps, [
		"ref",
		"onPointerEnter",
		"onPointerLeave",
		"onFocus",
		"onBlur",
	]);

	const onPointerEnter: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerEnter);

		if (e.pointerType === "touch" || others.disabled || e.defaultPrevented) {
			return;
		}

		context.cancelClosing();

		if (!context.isOpen()) {
			context.openWithDelay();
		}
	};

	const onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerLeave);

		if (e.pointerType === "touch") {
			return;
		}

		context.cancelOpening();
	};

	const onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocus);

		if (others.disabled || e.defaultPrevented) {
			return;
		}

		context.cancelClosing();

		if (!context.isOpen()) {
			context.openWithDelay();
		}
	};

	const onBlur: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onBlur);

		context.cancelOpening();

		const relatedTarget = e.relatedTarget as Node | null;

		if (context.isTargetOnHoverCard(relatedTarget)) {
			return;
		}

		context.closeWithDelay();
	};

	onCleanup(context.cancelOpening);

	return (
		<Link.Root<
			Component<
				Omit<HoverCardTriggerRenderProps, keyof Link.LinkRootRenderProps>
			>
		>
			ref={mergeRefs(context.setTriggerRef, local.ref)}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			onFocus={onFocus}
			onBlur={onBlur}
			{...context.dataset()}
			{...others}
		/>
	);
}
