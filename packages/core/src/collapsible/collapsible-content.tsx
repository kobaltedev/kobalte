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
	onCleanup,
	splitProps,
} from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";
import createPresence from "solid-presence";
import {
	CollapsibleDataSet,
	useCollapsibleContext,
} from "./collapsible-context";

export interface CollapsibleContentOptions {}

export interface CollapsibleContentCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties;
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
	let ref: HTMLElement | undefined;

	const context = useCollapsibleContext();

	const mergedProps = mergeDefaultProps(
		{ id: context.generateId("content") },
		props as CollapsibleContentProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "id", "style"]);

	const { present } = createPresence({
		show: context.shouldMount,
		element: () => ref ?? null,
	});

	const size = createSize(() => ref);

	createEffect(() => onCleanup(context.registerContentId(local.id)));

	return (
		<Show when={present()}>
			<Polymorphic<CollapsibleContentRenderProps>
				as="div"
				ref={mergeRefs((el) => {
					ref = el;
				}, local.ref)}
				id={local.id}
				style={{
					"--kb-collapsible-content-height": size.height()
						? `${height()}px`
						: undefined,
					"--kb-collapsible-content-width": size.width()
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
