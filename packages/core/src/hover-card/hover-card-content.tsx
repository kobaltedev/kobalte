import { mergeRefs } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	type Component,
	omit,
	Show,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	DismissableLayer,
	type DismissableLayerRenderProps,
} from "../dismissable-layer";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { Popper } from "../popper";
import {
	type HoverCardDataSet,
	useHoverCardContext,
} from "./hover-card-context";

export interface HoverCardContentOptions {}

export interface HoverCardContentOptions {}

export interface HoverCardContentCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
	style?: JSX.CSSProperties | string;
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

	const p = props as HoverCardContentProps;
	const others = omit(p, "ref", "style");

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
					}, p.ref)}
					disableOutsidePointerEvents={false}
					style={combineStyle(
						{
							"--kb-hovercard-content-transform-origin":
								"var(--kb-popper-content-transform-origin)",
							position: "relative",
						},
						p.style,
					)}
					onFocusOutside={(e) => e.preventDefault()}
					onDismiss={context.close}
					{...context.dataset()}
					{...others}
				/>
			</Popper.Positioner>
		</Show>
	);
}
