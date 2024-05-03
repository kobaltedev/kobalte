/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */

import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	JSX,
	Show,
	ValidComponent,
	createEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
	splitProps,
} from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { createPresence } from "../primitives";
import {
	CollapsibleDataSet,
	useCollapsibleContext,
} from "./collapsible-context";

export interface CollapsibleContentOptions {}

export interface CollapsibleContentCommonProps {
	id: string;
	ref: HTMLElement | ((el: HTMLElement) => void);
	style: JSX.CSSProperties;
}

export interface CollapsibleContentRenderProps
	extends CollapsibleContentCommonProps,
		CollapsibleDataSet {}

export type CollapsibleContentProps = CollapsibleContentOptions &
	Partial<CollapsibleContentCommonProps>;

/**
 * Contains the content to be rendered when the collapsible is expanded.
 */
export function CollapsibleContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CollapsibleContentProps>,
) {
	let ref: HTMLElement | undefined;

	const context = useCollapsibleContext();

	const mergedProps = mergeDefaultProps(
		{ id: context.generateId("content") },
		props as CollapsibleContentProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "id", "style"]);

	const presence = createPresence(() => context.shouldMount());

	const [height, setHeight] = createSignal(0);
	const [width, setWidth] = createSignal(0);

	// When opening we want it to immediately open to retrieve dimensions.
	// When closing we delay `isPresent` to retrieve dimensions before closing.
	const isOpen = () => context.isOpen() || presence.isPresent();

	let isMountAnimationPrevented = isOpen();
	let originalStyles: Record<string, string> | undefined;

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
			 * depends on `presence.isPresent` because it will be `false` on
			 * animation end (so when close finishes). This allows us to
			 * retrieve the dimensions *before* closing.
			 */
			[() => presence.isPresent()],
			() => {
				if (!ref) {
					return;
				}

				originalStyles = originalStyles || {
					transitionDuration: ref.style.transitionDuration,
					animationName: ref.style.animationName,
				};

				// block any animations/transitions so the element renders at its full dimensions
				ref.style.transitionDuration = "0s";
				ref.style.animationName = "none";

				// get width and height from full dimensions
				const rect = ref.getBoundingClientRect();
				setHeight(rect.height);
				setWidth(rect.width);

				// kick off any animations/transitions that were originally set up if it isn't the initial mount
				if (!isMountAnimationPrevented) {
					ref.style.transitionDuration = originalStyles.transitionDuration;
					ref.style.animationName = originalStyles.animationName;
				}
			},
		),
	);

	createEffect(() => onCleanup(context.registerContentId(local.id)));

	return (
		<Show when={presence.isPresent()}>
			<Polymorphic<CollapsibleContentRenderProps>
				as="div"
				ref={mergeRefs((el) => {
					presence.setRef(el);
					ref = el;
				}, local.ref)}
				id={local.id}
				style={{
					"--kb-collapsible-content-height": height()
						? `${height()}px`
						: undefined,
					"--kb-collapsible-content-width": width()
						? `${width()}px`
						: undefined,
					...local.style,
				}}
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
