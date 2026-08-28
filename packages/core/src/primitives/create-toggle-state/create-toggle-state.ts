import {
	createToggleState as createControllableToggleState,
	type ToggleState,
} from "@solid-primitives/controlled-signal";
import { access, type MaybeAccessor } from "@solid-primitives/utils";

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

export type { ToggleState };

/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export function createToggleState(
	props: CreateToggleStateProps = {},
): ToggleState {
	return createControllableToggleState({
		isSelected: () => access(props.isSelected),
		defaultIsSelected: () => access(props.defaultIsSelected),
		isDisabled: () => access(props.isDisabled),
		isReadOnly: () => access(props.isReadOnly),
		onSelectedChange: props.onSelectedChange,
	});
}
