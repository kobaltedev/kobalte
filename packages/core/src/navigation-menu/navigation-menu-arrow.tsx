import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	Component,
	ValidComponent,
	createEffect,
	createSignal,
	on,
	splitProps,
} from "solid-js";

import { useMenubarContext } from "../menubar/menubar-context";
import { PolymorphicProps } from "../polymorphic";
import {
	PopperArrowCommonProps,
	PopperArrowOptions,
	PopperArrowRenderProps,
} from "../popper";
import { PopperArrow } from "../popper/popper-arrow";

export interface NavigationMenuArrowOptions extends PopperArrowOptions {}

export interface NavigationMenuArrowCommonProps
	extends PopperArrowCommonProps {}

export interface NavigationMenuArrowRenderProps
	extends NavigationMenuArrowCommonProps,
		PopperArrowRenderProps {}

export type NavigationMenuArrowProps = NavigationMenuArrowOptions &
	Partial<NavigationMenuArrowCommonProps>;

/**
 * An optional arrow element to render alongside the viewport content.
 * Must be rendered in the viewport.
 */
export function NavigationMenuArrow<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, NavigationMenuArrowProps>,
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

	createEffect(
		on(
			() => [menubarContext.value(), menubarContext.dataset()],
			([value]) => {
				if (!value || value.includes("link-trigger-")) return;
				const triggerRef = document.querySelector(
					`[data-kb-menu-value-trigger="${value}"]`,
				);
				if (!triggerRef || !ref) return;

				const middle =
					triggerRef.getBoundingClientRect().x +
					triggerRef.getBoundingClientRect().width / 2;
				const initalArrowPos =
					ref.getBoundingClientRect().x +
					ref.getBoundingClientRect().width / 2 -
					offset();

				setOffset(middle - initalArrowPos);
			},
		),
	);

	return (
		<PopperArrow<
			Component<
				Omit<NavigationMenuArrowRenderProps, keyof PopperArrowRenderProps>
			>
		>
			ref={mergeRefs((el) => (ref = el), local.ref)}
			style={{
				transform: `translateX(${offset()}px)`,
				color: "red",
			}}
			{...others}
		/>
	);
}
