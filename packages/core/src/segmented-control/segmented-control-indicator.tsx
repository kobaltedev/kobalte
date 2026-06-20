import {
	type JSX,
	type ValidComponent,
	createEffect,
	createSignal,
	omit,
	on,
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

	const computeStyle = () => {
		const element = context.selectedItem();

		if (!element) {
			// TODO: Listen for transition to end here before removing the style.
			setStyle(undefined);
			return;
		}

		setStyle({
			width: `${element.offsetWidth}px`,
			height: `${element.offsetHeight}px`,
			transform: computeTransform(element),
			"transition-duration": resizing() ? "0ms" : undefined,
		});
	};

	const computeTransform = (element: HTMLElement): string | undefined => {
		const style = getComputedStyle(element.parentElement as HTMLElement);

		const x = element.offsetLeft - Number.parseFloat(style.paddingLeft);
		const y = element.offsetTop - Number.parseFloat(style.paddingTop);

		return `translate(${x}px, ${y}px)`;
	};

	createEffect(
		on(context.selectedItem, () => {
			setResizing(!style());
			computeStyle();
			setResizing(false);
		}),
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
