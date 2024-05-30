import { mergeRefs } from "@kobalte/utils";
import { Component, JSX, Show, ValidComponent, splitProps } from "solid-js";

import {
	DismissableLayer,
	DismissableLayerRenderProps,
} from "../dismissable-layer";
import { ElementOf, PolymorphicProps } from "../polymorphic";
import { Popper } from "../popper";
import { HoverCardDataSet, useHoverCardContext } from "./hover-card-context";

export interface HoverCardContentOptions {}

export interface HoverCardContentOptions {}

export interface HoverCardContentCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
}

export interface HoverCardContentRenderProps
	extends HoverCardContentCommonProps,
		DismissableLayerRenderProps,
		HoverCardDataSet {}

export type HoverCardContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = HoverCardContentOptions &
	Partial<HoverCardContentCommonProps<ElementOf<T>>>;

/**
 * Contains the content to be rendered when the hovercard is open.
 */
export function HoverCardContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, HoverCardContentProps<T>>,
) {
	const context = useHoverCardContext();

	const [local, others] = splitProps(props as HoverCardContentProps, [
		"ref",
		"style",
	]);

	return (
		<Show when={context.contentPresent()}>
			<Popper.Positioner>
				<DismissableLayer<
					Component<
						Omit<HoverCardContentRenderProps, keyof DismissableLayerRenderProps>
					>
				>
					ref={mergeRefs((el) => {
						context.setContentRef(el);
					}, local.ref)}
					disableOutsidePointerEvents={false}
					style={{
						"--kb-hovercard-content-transform-origin":
							"var(--kb-popper-content-transform-origin)",
						position: "relative",
						...local.style,
					}}
					onFocusOutside={(e) => e.preventDefault()}
					onDismiss={context.close}
					{...context.dataset()}
					{...others}
				/>
			</Popper.Positioner>
		</Show>
	);
}
