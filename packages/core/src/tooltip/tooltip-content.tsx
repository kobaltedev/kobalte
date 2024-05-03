/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/1b05a8e35cf35f3020484979086d70aefbaf4095/packages/react/tooltip/src/Tooltip.tsx
 */

import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	Component,
	JSX,
	Show,
	ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import {
	DismissableLayer,
	DismissableLayerRenderProps,
} from "../dismissable-layer";
import { PolymorphicProps } from "../polymorphic";
import { Popper } from "../popper";
import { PointerDownOutsideEvent } from "../primitives";
import { TooltipDataSet, useTooltipContext } from "./tooltip-context";

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

export interface TooltipContentCommonProps {
	id: string;
	ref: HTMLElement | ((el: HTMLElement) => void);

	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
}

export interface TooltipContentRenderProps
	extends TooltipContentCommonProps,
		DismissableLayerRenderProps,
		TooltipDataSet {
	role: "tooltip";
}

export type TooltipContentProps = TooltipContentOptions &
	Partial<TooltipContentCommonProps>;

/**
 * Contains the content to be rendered when the tooltip is open.
 */
export function TooltipContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TooltipContentProps>,
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
		<Show when={context.contentPresence.isPresent()}>
			<Popper.Positioner>
				<DismissableLayer<
					Component<
						Omit<TooltipContentRenderProps, keyof DismissableLayerRenderProps>
					>
				>
					ref={mergeRefs((el) => {
						context.setContentRef(el);
						context.contentPresence.setRef(el);
					}, local.ref)}
					role="tooltip"
					disableOutsidePointerEvents={false}
					style={{
						"--kb-tooltip-content-transform-origin":
							"var(--kb-popper-content-transform-origin)",
						position: "relative",
						...local.style,
					}}
					onFocusOutside={(e) => e.preventDefault()}
					onDismiss={() => context.hideTooltip(true)}
					{...context.dataset()}
					{...others}
				/>
			</Popper.Positioner>
		</Show>
	);
}
