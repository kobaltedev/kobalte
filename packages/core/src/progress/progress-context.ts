import { Accessor, createContext, useContext } from "solid-js";

export interface ProgressDataSet {
  "data-progress": "loading" | "complete" | undefined;
  "data-indeterminate": string | undefined;
}

export interface ProgressContextValue {
  dataset: Accessor<ProgressDataSet>;
  value: Accessor<number>;
  valuePercent: Accessor<number>;
  valueLabel: Accessor<string | undefined>;
  progressFillWidth: Accessor<string | undefined>;
  labelId: Accessor<string | undefined>;
  generateId: (part: string) => string;
  registerLabelId: (id: string) => () => void;
}

export const ProgressContext = createContext<ProgressContextValue>();

export function useProgressContext() {
  const context = useContext(ProgressContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useProgressContext` must be used within a `Progress.Root` component"
    );
  }

  return context;
}
