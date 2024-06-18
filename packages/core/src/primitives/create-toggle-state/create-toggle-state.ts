/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-stately/toggle/src/useToggleState.ts
 */

import { type MaybeAccessor, access } from "@kobalte/utils";
import type { Accessor } from "solid-js";

import { createControllableBooleanSignal } from "../create-controllable-signal";

export interface CreateToggleStateProps {
	/** The controlled selected state. */
	isSelected?: MaybeAccessor<boolean | undefined>;

	/**
	 * The default selected state when initially rendered.
	 * Useful when you do not need to control the selected state.
	 */
	defaultIsSelected?: MaybeAccessor<boolean | undefined>;

	/** Whether the selected state cannot be changed by the user. */
	isDisabled?: MaybeAccessor<boolean | undefined>;

	/** Whether the selected state cannot be changed by the user. */
	isReadOnly?: MaybeAccessor<boolean | undefined>;

	/** Event handler called when the selected state changes. */
	onSelectedChange?: (isSelected: boolean) => void;
}

export interface ToggleState {
	/** The selected state. */
	isSelected: Accessor<boolean>;

	/** Updates the selected state. */
	setIsSelected: (isSelected: boolean) => void;

	/** Toggle the selected state. */
	toggle: () => void;
}

/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export function createToggleState(
	props: CreateToggleStateProps = {},
): ToggleState {
	const [isSelected, _setIsSelected] = createControllableBooleanSignal({
		value: () => access(props.isSelected),
		defaultValue: () => !!access(props.defaultIsSelected),
		onChange: (value) => props.onSelectedChange?.(value),
	});

	const setIsSelected = (value: boolean) => {
		if (!access(props.isReadOnly) && !access(props.isDisabled)) {
			_setIsSelected(value);
		}
	};

	const toggle = () => {
		if (!access(props.isReadOnly) && !access(props.isDisabled)) {
			_setIsSelected(!isSelected());
		}
	};

	return {
		isSelected,
		setIsSelected,
		toggle,
	};
}
