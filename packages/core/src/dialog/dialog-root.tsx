import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { type ParentProps, createSignal, createUniqueId } from "solid-js";

import createPresence from "solid-presence";
import { createDisclosureState, createRegisterId } from "../primitives";
import { DialogContext, type DialogContextValue } from "./dialog-context";
import {
	DIALOG_INTL_TRANSLATIONS,
	type DialogIntlTranslations,
} from "./dialog.intl";

export interface DialogRootOptions {
	/** The localized strings of the component. */
	translations?: DialogIntlTranslations;

	/** The controlled open state of the dialog. */
	open?: boolean;

	/**
	 * The default open state when initially rendered.
	 * Useful when you do not need to control the open state.
	 */
	defaultOpen?: boolean;

	/** Event handler called when the open state of the dialog changes. */
	onOpenChange?: (isOpen: boolean) => void;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * Whether the dialog should be the only visible content for screen readers.
	 * When set to `true`:
	 * - interaction with outside elements will be disabled.
	 * - scroll will be locked.
	 * - focus will be locked inside the dialog content.
	 * - elements outside the dialog content will not be visible for screen readers.
	 */
	modal?: boolean;

	/** Whether the scroll should be locked even if the dialog is not modal. */
	preventScroll?: boolean;

	/**
	 * Used to force mounting the dialog (portal, overlay and content) when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface DialogRootProps extends ParentProps<DialogRootOptions> {}

/**
 * A dialog is a window overlaid on either the primary window or another dialog window.
 */
export function DialogRoot(props: DialogRootProps) {
	const defaultId = `dialog-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			modal: true,
			translations: DIALOG_INTL_TRANSLATIONS,
		},
		props,
	);

	const [contentId, setContentId] = createSignal<string>();
	const [titleId, setTitleId] = createSignal<string>();
	const [descriptionId, setDescriptionId] = createSignal<string>();

	const [overlayRef, setOverlayRef] = createSignal<HTMLElement>();
	const [contentRef, setContentRef] = createSignal<HTMLElement>();
	const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();

	const disclosureState = createDisclosureState({
		open: () => mergedProps.open,
		defaultOpen: () => mergedProps.defaultOpen,
		onOpenChange: (isOpen) => mergedProps.onOpenChange?.(isOpen),
	});

	const shouldMount = () => mergedProps.forceMount || disclosureState.isOpen();

	const { present: overlayPresent } = createPresence({
		show: shouldMount,
		element: () => overlayRef() ?? null,
	});

	const { present: contentPresent } = createPresence({
		show: shouldMount,
		element: () => contentRef() ?? null,
	});

	const context: DialogContextValue = {
		translations: () => mergedProps.translations ?? DIALOG_INTL_TRANSLATIONS,
		isOpen: disclosureState.isOpen,
		modal: () => mergedProps.modal ?? true,
		preventScroll: () => mergedProps.preventScroll ?? context.modal(),
		contentId,
		titleId,
		descriptionId,
		triggerRef,
		overlayRef,
		setOverlayRef,
		contentRef,
		setContentRef,
		overlayPresent,
		contentPresent,
		close: disclosureState.close,
		toggle: disclosureState.toggle,
		setTriggerRef,
		generateId: createGenerateId(() => mergedProps.id!),
		registerContentId: createRegisterId(setContentId),
		registerTitleId: createRegisterId(setTitleId),
		registerDescriptionId: createRegisterId(setDescriptionId),
	};

	return (
		<DialogContext.Provider value={context}>
			{mergedProps.children}
		</DialogContext.Provider>
	);
}
