import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createEffect,
	createSignal,
	on,
	splitProps,
} from "solid-js";

import { useMenubarContext } from "../menubar/menubar-context";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import type {
	PopperArrowCommonProps,
	PopperArrowOptions,
	PopperArrowRenderProps,
} from "../popper";
import { PopperArrow } from "../popper/popper-arrow";

export interface NavigationMenuArrowOptions extends PopperArrowOptions {}

export interface NavigationMenuArrowCommonProps<
	T extends HTMLElement = HTMLElement,
> extends PopperArrowCommonProps<T> {}

export interface NavigationMenuArrowRenderProps
	extends NavigationMenuArrowCommonProps,
		PopperArrowRenderProps {}

export type NavigationMenuArrowProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = NavigationMenuArrowOptions &
	Partial<NavigationMenuArrowCommonProps<ElementOf<T>>>;

/**
 * An optional arrow element to render alongside the viewport content.
 * Must be rendered in the viewport.
 */
export function NavigationMenuArrow<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, NavigationMenuArrowProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const menubarContext = useMenubarContext();

	const mergedProps = mergeDefaultProps(
		{
			size: 15,
		},
		props as NavigationMenuArrowProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref"]);

	const [offset, setOffset] = createSignal(0);

	const horizontal = () => menubarContext.orientation() === "horizontal";

	createEffect(
		on(menubarContext.value, (value) => {
			setTimeout(() => {
				if (!value || (value as string).includes("link-trigger-")) return;
				const triggerRef = document.querySelector(
					`[data-kb-menu-value-trigger="${value}"]`,
				);
				if (!triggerRef || !ref) return;

				const middle =
					triggerRef.getBoundingClientRect()[horizontal() ? "x" : "y"] +
					triggerRef.getBoundingClientRect()[
						horizontal() ? "width" : "height"
					] /
						2;

				const computed = window.getComputedStyle(ref);

				const initalArrowPos =
					ref.getBoundingClientRect()[horizontal() ? "x" : "y"] +
					ref.getBoundingClientRect()[horizontal() ? "width" : "height"] / 2 -
					Number.parseFloat(
						computed.transform.split(",")[horizontal() ? 4 : 5],
					);

				setOffset(middle - initalArrowPos);
			});
		}),
	);

	return (
		<PopperArrow<
			Component<
				Omit<NavigationMenuArrowRenderProps, keyof PopperArrowRenderProps>
			>
		>
			ref={mergeRefs((el) => (ref = el), local.ref)}
			style={{
				transform: `translate${horizontal() ? "X" : "Y"}(${offset()}px)`,
				color: "red",
			}}
			{...others}
		/>
	);
}
