import type { Orientation } from "@kobalte/utils";
import { type Accessor, createContext, useContext } from "solid-js";

export type StepState = "complete" | "current" | "incomplete";

export interface StepsContextValue {
	/** The index of the current step (equals `count` once completed). */
	value: Accessor<number>;

	/** The total number of steps. */
	count: Accessor<number>;

	/** The completion percentage, between 0 and 100. */
	percent: Accessor<number>;

	orientation: Accessor<Orientation>;

	/** Whether there is a step after the current one. */
	hasNextStep: Accessor<boolean>;

	/** Whether there is a step before the current one. */
	hasPrevStep: Accessor<boolean>;

	/** Whether every step has been completed. */
	isCompleted: Accessor<boolean>;

	/** Returns whether the step at `index` is valid for forward navigation. */
	isStepValid: (index: number) => boolean;

	/** Returns whether the step at `index` is skipped over by next/prev navigation. */
	isStepSkippable: (index: number) => boolean;

	/** Returns the current status of the step at `index`. */
	getItemState: (index: number) => StepState;

	/** Returns whether a trigger may navigate directly to `index` right now. */
	canChangeStep: (index: number) => boolean;

	/**
	 * Attempts to navigate directly to `index` (as from clicking a
	 * `Steps.Trigger`): a no-op if `index` is already current, navigates if
	 * `canChangeStep(index)` allows it, otherwise fires `onStepInvalid`.
	 */
	changeStep: (index: number) => void;

	/** Directly sets the current step, clamped to `[0, count]`. Not subject to `linear` validation. */
	setStep: (index: number) => void;

	/** Advances to the next (non-skipped) step, subject to `linear` validation. */
	goToNextStep: () => void;

	/** Returns to the previous (non-skipped) step. */
	goToPrevStep: () => void;

	/** Resets to the first step. */
	resetStep: () => void;

	generateId: (part: string) => string;
}

export const StepsContext = createContext<StepsContextValue>();

export function useStepsContext() {
	const context = useContext(StepsContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useStepsContext` must be used within a `Steps` component",
		);
	}

	return context;
}
