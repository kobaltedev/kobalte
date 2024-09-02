/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */

import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	type JSX,
	Show,
	type ValidComponent,
	createEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import createPresence from "solid-presence";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type CollapsibleDataSet,
	useCollapsibleContext,
} from "./collapsible-context";

export interface CollapsibleContentOptions {}

export interface CollapsibleContentCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties | string;
}

export interface CollapsibleContentRenderProps
	extends CollapsibleContentCommonProps,
		CollapsibleDataSet {}

export type CollapsibleContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CollapsibleContentOptions &
	Partial<CollapsibleContentCommonProps<ElementOf<T>>>;

/**
 * Contains the content to be rendered when the collapsible is expanded.
 */
export function CollapsibleContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CollapsibleContentProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement>();

	const context = useCollapsibleContext();

	const mergedProps = mergeDefaultProps(
		{ id: context.generateId("content") },
		props as CollapsibleContentProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "id", "style"]);

	const { present } = createPresence({
		show: context.shouldMount,
		element: () => ref() ?? null,
	});

	const [height, setHeight] = createSignal(0);
	const [width, setWidth] = createSignal(0);

	// When opening we want it to immediately open to retrieve dimensions.
	// When closing we delay `present` to retrieve dimensions before closing.
	const isOpen = () => context.isOpen() || present();
	let isMountAnimationPrevented = isOpen();

	onMount(() => {
		const raf = requestAnimationFrame(() => {
			isMountAnimationPrevented = false;
		});

		onCleanup(() => {
			cancelAnimationFrame(raf);
		});
	});

	createEffect(
		on(
			/**
			 * depends on `present` because it will be `false` on
			 * animation end (so when close finishes). This allows us to
			 * retrieve the dimensions *before* closing.
			 */
			present,
			() => {
				if (!ref()) {
					return;
				}

				// block any animations/transitions so the element renders at its full dimensions
				ref()!.style.transitionDuration = "0s";
				ref()!.style.animationName = "none";

				// get width and height from full dimensions
				const rect = ref()!.getBoundingClientRect();
				setHeight(rect.height);
				setWidth(rect.width);

				// kick off any animations/transitions that were originally set up if it isn't the initial mount
				if (!isMountAnimationPrevented) {
					ref()!.style.transitionDuration = "";
					ref()!.style.animationName = "";
				}
			},
		),
	);

	createEffect(
		on(
			context.isOpen,
			(open) => {
				if (!open && ref()) {
					ref()!.style.transitionDuration = "";
					ref()!.style.animationName = "";
				}
			},
			{ defer: true },
		),
	);

	createEffect(() => onCleanup(context.registerContentId(local.id)));

	return (
		<Show when={present()}>
			<Polymorphic<CollapsibleContentRenderProps>
				as="div"
				ref={mergeRefs(setRef, local.ref)}
				id={local.id}
				style={combineStyle(
					{
						"--kb-collapsible-content-height": height()
							? `${height()}px`
							: undefined,
						"--kb-collapsible-content-width": width()
							? `${width()}px`
							: undefined,
					},
					local.style,
				)}
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
