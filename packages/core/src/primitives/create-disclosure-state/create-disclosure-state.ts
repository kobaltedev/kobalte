import { type MaybeAccessor, access } from "@kobalte/utils";
import type { Accessor } from "solid-js";

import { createControllableBooleanSignal } from "../create-controllable-signal";

export interface CreateDisclosureStateProps {
	/** The value to be used, in controlled mode. */
	open?: MaybeAccessor<boolean | undefined>;

	/** The initial value to be used, in uncontrolled mode. */
	defaultOpen?: MaybeAccessor<boolean | undefined>;

	/** A function that will be called when the `isOpen` state changes. */
	onOpenChange?: (isOpen: boolean) => void;
}

export interface CreateDisclosureStateResult {
	/** The open state. */
	isOpen: Accessor<boolean>;

	/** A setter function to manually set the open state. */
	setIsOpen: (next: boolean | ((prev: boolean) => boolean)) => void;

	/** A function to set the `isOpen` state to `true`. */
	open: () => void;

	/** A function to set the `isOpen` state to `false`. */
	close: () => void;

	/** A function to toggle the `isOpen` state between `true` and `false`. */
	toggle: () => void;
}

/**
 * Provides state management for open, close and toggle scenarios.
 * Used to control the "open state" of components like Modal, Drawer, etc.
 */
export function createDisclosureState(
	props: CreateDisclosureStateProps = {},
): CreateDisclosureStateResult {
	const [isOpen, setIsOpen] = createControllableBooleanSignal({
		value: () => access(props.open),
		defaultValue: () => !!access(props.defaultOpen),
		onChange: (value) => props.onOpenChange?.(value),
	});

	const open = () => {
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
	};

	const toggle = () => {
		isOpen() ? close() : open();
	};

	return {
		isOpen,
		setIsOpen,
		open,
		close,
		toggle,
	};
}
