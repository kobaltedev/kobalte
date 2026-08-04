import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { type Component, createEffect, createSignal, omit } from "solid-js";

import { useMenubarContext } from "../menubar/menubar-context.tsx";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";
import type {
	PopperArrowCommonProps,
	PopperArrowOptions,
	PopperArrowRenderProps,
} from "../popper/index.tsx";
import { PopperArrow } from "../popper/popper-arrow.tsx";

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
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const menubarContext = useMenubarContext();

	const mergedProps = mergeDefaultProps(
		{
			size: 15,
		},
		props as NavigationMenuArrowProps,
	);

	const others = omit(mergedProps, "ref");

	const [offset, setOffset] = createSignal(0);

	const horizontal = () => menubarContext.orientation() === "horizontal";

	createEffect(
		() => menubarContext.value(),
		(value) => {
			setTimeout(() => {
				if (!value || (value as string).includes("link-trigger-")) return;
				const triggerRef = document.querySelector(
					`[data-kb-menu-value-trigger="${value}"]`,
				);
				if (!triggerRef || !ref()) return;

				const arrowRef = ref()!;

				const middle =
					triggerRef.getBoundingClientRect()[horizontal() ? "x" : "y"] +
					triggerRef.getBoundingClientRect()[
						horizontal() ? "width" : "height"
					] /
						2;

				const computed = window.getComputedStyle(arrowRef);

				const initalArrowPos =
					arrowRef.getBoundingClientRect()[horizontal() ? "x" : "y"] +
					arrowRef.getBoundingClientRect()[horizontal() ? "width" : "height"] /
						2 -
					Number.parseFloat(
						computed.transform.split(",")[horizontal() ? 4 : 5],
					);

				setOffset(middle - initalArrowPos);
			});
		},
	);

	return (
		<PopperArrow<
			Component<
				Omit<NavigationMenuArrowRenderProps, keyof PopperArrowRenderProps>
			>
		>
			ref={[setRef, mergedProps.ref]}
			style={{
				transform: `translate${horizontal() ? "X" : "Y"}(${offset()}px)`,
				color: "red",
			}}
			{...others}
		/>
	);
}
