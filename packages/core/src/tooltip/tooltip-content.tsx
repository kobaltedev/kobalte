/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/1b05a8e35cf35f3020484979086d70aefbaf4095/packages/react/tooltip/src/Tooltip.tsx
 */

import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	Show,
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	DismissableLayer,
	type DismissableLayerRenderProps,
} from "../dismissable-layer";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { Popper } from "../popper";
import type { PointerDownOutsideEvent } from "../primitives";
import { type TooltipDataSet, useTooltipContext } from "./tooltip-context";

export interface TooltipContentOptions {
	/**
	 * Event handler called when the escape key is down.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;

	/**
	 * Event handler called when a pointer event occurs outside the bounds of the component.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
}

export interface TooltipContentCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	style?: JSX.CSSProperties | string;
}

export interface TooltipContentRenderProps
	extends TooltipContentCommonProps,
		DismissableLayerRenderProps,
		TooltipDataSet {
	role: "tooltip";
}

export type TooltipContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TooltipContentOptions & Partial<TooltipContentCommonProps<ElementOf<T>>>;

/**
 * Contains the content to be rendered when the tooltip is open.
 */
export function TooltipContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TooltipContentProps<T>>,
) {
	const context = useTooltipContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("content"),
		},
		props as TooltipContentProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "style"]);

	createEffect(() => onCleanup(context.registerContentId(others.id!)));

	return (
		<Show when={context.contentPresent()}>
			<Popper.Positioner>
				<DismissableLayer<
					Component<
						Omit<TooltipContentRenderProps, keyof DismissableLayerRenderProps>
					>
				>
					ref={mergeRefs((el) => {
						context.setContentRef(el);
					}, local.ref)}
					role="tooltip"
					disableOutsidePointerEvents={false}
					style={combineStyle(
						{
							"--kb-tooltip-content-transform-origin":
								"var(--kb-popper-content-transform-origin)",
							position: "relative",
						},
						local.style,
					)}
					onFocusOutside={(e) => e.preventDefault()}
					onDismiss={() => context.hideTooltip(true)}
					{...context.dataset()}
					{...others}
				/>
			</Popper.Positioner>
		</Show>
	);
}
