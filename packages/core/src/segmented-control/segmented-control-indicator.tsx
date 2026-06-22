import { type JSX, type ValidComponent } from "@solidjs/web";
import {
	createEffect,
	createSignal,
	omit,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import { createResizeObserver } from "@solid-primitives/resize-observer";
import { Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useSegmentedControlContext } from "./segmented-control-context";

export interface SegmentedControlIndicatorOptions {}

export interface SegmentedControlIndicatorCommonProps {
	style?: JSX.CSSProperties | string;
}

export interface SegmentedControlIndicatorRenderProps
	extends SegmentedControlIndicatorCommonProps {
	role: "presentation";
}

export type SegmentedControlIndicatorProps = SegmentedControlIndicatorOptions &
	Partial<SegmentedControlIndicatorCommonProps>;

export function SegmentedControlIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SegmentedControlIndicatorProps>,
) {
	const context = useSegmentedControlContext();

	const otherProps = omit(props, "style");

	const [style, setStyle] = createSignal<JSX.CSSProperties>();
	const [resizing, setResizing] = createSignal(false);

	const computeStyle = (element?: HTMLElement) => {
		const el = element ?? context.selectedItem();

		if (!el) {
			// TODO: Listen for transition to end here before removing the style.
			setStyle(undefined);
			return;
		}

		const rect = el.getBoundingClientRect();
		setStyle({
			width: `${rect.width}px`,
			height: `${rect.height}px`,
			transform: computeTransform(el),
			"transition-duration": resizing() ? "0ms" : undefined,
		});
	};

	const computeTransform = (element: HTMLElement): string | undefined => {
		const rootEl = context.root();
		if (!rootEl) return undefined;

		const rootRect = rootEl.getBoundingClientRect();
		const itemRect = element.getBoundingClientRect();

		const x = itemRect.left - rootRect.left;
		const y = itemRect.top - rootRect.top;

		return `translate(${x}px, ${y}px)`;
	};

	createEffect(
		() => context.selectedItem(),
		(element) => {
			setResizing(!style());
			computeStyle(element);
			setResizing(false);
		},
	);

	createResizeObserver(context.root, () => {
		setResizing(true);
		computeStyle();
		setResizing(false);
	});

	return (
		<Polymorphic<SegmentedControlIndicatorRenderProps>
			as="div"
			role="presentation"
			style={combineStyle(style(), props.style)}
			data-resizing={resizing()}
			data-orientation={context.orientation()}
			{...otherProps}
		/>
	);
}
