import {
	type JSX,
	type ValidComponent,
	batch,
	createEffect,
	createSignal,
	on,
	splitProps,
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

	const [localProps, otherProps] = splitProps(props, ["style"]);

	const [style, setStyle] = createSignal<JSX.CSSProperties>();
	const [resizing, setResizing] = createSignal(false);

	const computeStyle = () => {
		const el = context.selectedItem();
		if (!el) return;

		setStyle({
			width: `${el.offsetWidth}px`,
			height: `${el.offsetHeight}px`,
			transform: computeTransform(el),
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
			// This effect should only run if the style is set; otherwise, the style will be computed
			// in the resize observer callback, which will prevent the initial transition while resizing.
			if (!style()) return;

			computeStyle();
		}),
	);

	createResizeObserver(context.root, () => {
		batch(() => {
			setResizing(true);
			computeStyle();
			setResizing(false);
		});
	});

	return (
		<Polymorphic<SegmentedControlIndicatorRenderProps>
			as="div"
			role="presentation"
			style={combineStyle(style(), localProps.style)}
			data-resizing={resizing()}
			data-orientation={context.orientation()}
			{...otherProps}
		/>
	);
}
