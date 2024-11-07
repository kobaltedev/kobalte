// src/stepper/stepper.types.ts
export interface StepperState {
  /** The index of the current active step. */
  activeStep: number;

  /** Whether the stepper navigation is in progress. */
  isNavigating: boolean;
}

export interface StepperContextType {
  /** The state of the stepper. */
  state: StepperState;

  /** Updates the stepper state. */
  setState: (value: Partial<StepperState>) => void;

  /** The stepper options. */
  options: () => StepperRootOptions;
}

export interface StepperRootOptions {
  /** The controlled active step index. */
  activeStep?: number;

  /** The initial active step index when uncontrolled. */
  defaultActiveStep?: number;

  /** Callback fired when the active step changes. */
  onActiveStepChange?: (index: number) => void;

  /** The total number of steps. */
  count: number;

  /** Whether to allow clicking on next steps. */
  allowNextStepsSelect?: boolean;

  /** Whether the stepper is vertically oriented. */
  orientation?: "horizontal" | "vertical";
}

/** Shared render props interface */
export interface StepperDataAttributes {
  "data-active"?: boolean;
  "data-completed"?: boolean;
  "data-disabled"?: boolean;
  "data-orientation"?: "horizontal" | "vertical";
}
