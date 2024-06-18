/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */

import {
	OverrideComponentProps,
	createGenerateId,
	mergeDefaultProps,
} from "@kobalte/utils";
import {
	type Accessor,
	type ValidComponent,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createDisclosureState, createRegisterId } from "../primitives";
import {
	CollapsibleContext,
	type CollapsibleContextValue,
	type CollapsibleDataSet,
} from "./collapsible-context";

export interface CollapsibleRootOptions {
	/** The controlled open state of the collapsible. */
	open?: boolean;

	/**
	 * The default open state when initially rendered.
	 * Useful when you do not need to control the open state.
	 */
	defaultOpen?: boolean;

	/** Event handler called when the open state of the collapsible changes. */
	onOpenChange?: (isOpen: boolean) => void;

	/** Whether the collapsible is disabled. */
	disabled?: boolean;

	/**
	 * Used to force mounting the collapsible content when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface CollapsibleRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface CollapsibleRootRenderProps
	extends CollapsibleRootCommonProps,
		CollapsibleDataSet {}

export type CollapsibleRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CollapsibleRootOptions & Partial<CollapsibleRootCommonProps<ElementOf<T>>>;

/**
 * An interactive component which expands/collapses a content.
 */
export function CollapsibleRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CollapsibleRootProps<T>>,
) {
	const defaultId = `collapsible-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as CollapsibleRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"open",
		"defaultOpen",
		"onOpenChange",
		"disabled",
		"forceMount",
	]);

	const [contentId, setContentId] = createSignal<string>();

	const disclosureState = createDisclosureState({
		open: () => local.open,
		defaultOpen: () => local.defaultOpen,
		onOpenChange: (isOpen) => local.onOpenChange?.(isOpen),
	});

	const dataset: Accessor<CollapsibleDataSet> = createMemo(() => ({
		"data-expanded": disclosureState.isOpen() ? "" : undefined,
		"data-closed": !disclosureState.isOpen() ? "" : undefined,
		"data-disabled": local.disabled ? "" : undefined,
	}));

	const context: CollapsibleContextValue = {
		dataset,
		isOpen: disclosureState.isOpen,
		disabled: () => local.disabled ?? false,
		shouldMount: () => local.forceMount || disclosureState.isOpen(),
		contentId,
		toggle: disclosureState.toggle,
		generateId: createGenerateId(() => others.id!),
		registerContentId: createRegisterId(setContentId),
	};

	return (
		<CollapsibleContext.Provider value={context}>
			<Polymorphic<CollapsibleRootRenderProps>
				as="div"
				{...dataset()}
				{...others}
			/>
		</CollapsibleContext.Provider>
	);
}
