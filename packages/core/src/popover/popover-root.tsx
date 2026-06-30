/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit/src/popover/popover-state.ts
 */

import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createPresence } from "@solid-primitives/presence";
import {
	type Accessor,
	createMemo,
	createSignal,
	createUniqueId,
	omit,
	type ParentProps,
} from "solid-js";
import { Popper, type PopperRootOptions } from "../popper";
import { createDisclosureState, createRegisterId } from "../primitives";
import {
	POPOVER_INTL_TRANSLATIONS,
	type PopoverIntlTranslations,
} from "./popover.intl";
import {
	PopoverContext,
	type PopoverContextValue,
	type PopoverDataSet,
} from "./popover-context";

export interface PopoverRootOptions
	extends Omit<
		PopperRootOptions,
		"anchorRef" | "contentRef" | "onCurrentPlacementChange"
	> {
	/**
	 * A ref for the anchor element.
	 * Useful if you want to use an element outside `Popover` as the popover anchor.
	 */
	anchorRef?: Accessor<HTMLElement | undefined>;

	/** The controlled open state of the popover. */
	open?: boolean;

	/**
	 * The default open state when initially rendered.
	 * Useful when you do not need to control the open state.
	 */
	defaultOpen?: boolean;

	/** Event handler called when the open state of the popover changes. */
	onOpenChange?: (isOpen: boolean) => void;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * Whether the popover should be the only visible content for screen readers.
	 * When set to `true`:
	 * - interaction with outside elements will be disabled.
	 * - scroll will be locked.
	 * - focus will be locked inside the popover content.
	 * - elements outside the popover content will not be visible for screen readers.
	 */
	modal?: boolean;

	/** Whether the scroll should be locked even if the popover is not modal. */
	preventScroll?: boolean;

	/**
	 * Used to force mounting the popover (portal, positioner and content) when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;

	/** The localized strings of the component. */
	translations?: PopoverIntlTranslations;
}

export interface PopoverRootProps extends ParentProps<PopoverRootOptions> {}

/**
 * A popover is a dialog positioned relative to an anchor element.
 */
export function PopoverRoot(props: PopoverRootProps) {
	const defaultId = `popover-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			modal: false,
			translations: POPOVER_INTL_TRANSLATIONS,
		},
		props,
	);

	const others = omit(
		mergedProps,
		"translations",
		"id",
		"open",
		"defaultOpen",
		"onOpenChange",
		"modal",
		"preventScroll",
		"forceMount",
		"anchorRef",
	);

	const [defaultAnchorRef, setDefaultAnchorRef] = createSignal<
		HTMLElement | undefined
	>(undefined, { ownedWrite: true });
	const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>(
		undefined,
		{ ownedWrite: true },
	);
	const [contentRef, setContentRef] = createSignal<HTMLElement | undefined>(
		undefined,
		{ ownedWrite: true },
	);

	const [contentId, setContentId] = createSignal<string | undefined>(
		undefined,
		{ ownedWrite: true },
	);
	const [titleId, setTitleId] = createSignal<string | undefined>(undefined, {
		ownedWrite: true,
	});
	const [descriptionId, setDescriptionId] = createSignal<string | undefined>(
		undefined,
		{ ownedWrite: true },
	);

	const disclosureState = createDisclosureState({
		open: () => mergedProps.open,
		defaultOpen: () => mergedProps.defaultOpen,
		onOpenChange: (isOpen) => mergedProps.onOpenChange?.(isOpen),
	});

	const anchorRef = () => {
		return mergedProps.anchorRef?.() ?? defaultAnchorRef() ?? triggerRef();
	};

	const { isMounted: contentPresent } = createPresence(
		() => mergedProps.forceMount || disclosureState.isOpen() || undefined,
		{ transitionDuration: 0 },
	);

	const dataset: Accessor<PopoverDataSet> = createMemo(() => ({
		"data-expanded": disclosureState.isOpen() ? "" : undefined,
		"data-closed": !disclosureState.isOpen() ? "" : undefined,
	}));

	const context: PopoverContextValue = {
		translations: () => mergedProps.translations ?? POPOVER_INTL_TRANSLATIONS,
		dataset,
		isOpen: disclosureState.isOpen,
		isModal: () => mergedProps.modal ?? false,
		preventScroll: () => mergedProps.preventScroll ?? context.isModal(),
		contentPresent,
		triggerRef,
		contentId,
		titleId,
		descriptionId,
		setDefaultAnchorRef,
		setTriggerRef,
		setContentRef,
		close: disclosureState.close,
		toggle: disclosureState.toggle,
		generateId: createGenerateId(() => mergedProps.id!),
		registerContentId: createRegisterId(setContentId),
		registerTitleId: createRegisterId(setTitleId),
		registerDescriptionId: createRegisterId(setDescriptionId),
	};

	return (
		<PopoverContext value={context}>
			<Popper anchorRef={anchorRef} contentRef={contentRef} {...others} />
		</PopoverContext>
	);
}
