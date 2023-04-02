/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-aria/progress/src/useProgressBar.ts
 */

import { clamp, createGenerateId, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";

import { createNumberFormatter } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { createRegisterId } from "../primitives";
import { ProgressContext, ProgressContextValue, ProgressDataSet } from "./progress-context";

interface GetValueLabelParams {
  value: number;
  min: number;
  max: number;
}

export interface ProgressRootOptions extends AsChildProp {
  /**
   * The progress value.
   * @default 0
   */
  value?: number;

  /**
   * The minimum progress value.
   * @default 0
   */
  minValue?: number;

  /**
   * The maximum progress value.
   * @default 100
   */
  maxValue?: number;

  /** Whether the progress is in an indeterminate state. */
  indeterminate?: boolean;

  /**
   * A function to get the accessible label text representing the current value in a human-readable format.
   * If not provided, the value label will be read as a percentage of the max value.
   */
  getValueLabel?: (params: GetValueLabelParams) => string;
}

export interface ProgressRootProps extends OverrideComponentProps<"div", ProgressRootOptions> {}

/**
 * Progress show either determinate or indeterminate progress of an operation over time.
 */
export function ProgressRoot(props: ProgressRootProps) {
  const defaultId = `progress-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      value: 0,
      minValue: 0,
      maxValue: 100,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "value",
    "minValue",
    "maxValue",
    "indeterminate",
    "getValueLabel",
  ]);

  const [labelId, setLabelId] = createSignal<string>();

  const defaultFormatter = createNumberFormatter(() => ({ style: "percent" }));

  const value = () => {
    return clamp(local.value!, local.minValue!, local.maxValue!);
  };

  const valuePercent = () => {
    return (value() - local.minValue!) / (local.maxValue! - local.minValue!);
  };

  const valueLabel = () => {
    if (local.indeterminate) {
      return undefined;
    }

    if (local.getValueLabel) {
      return local.getValueLabel({
        value: value(),
        min: local.minValue!,
        max: local.maxValue!,
      });
    }

    return defaultFormatter().format(valuePercent());
  };

  const progressFillWidth = () => {
    return local.indeterminate ? undefined : `${Math.round(valuePercent() * 100)}%`;
  };

  const dataset: Accessor<ProgressDataSet> = createMemo(() => {
    let dataProgress: ProgressDataSet["data-progress"] = undefined;

    if (!local.indeterminate) {
      dataProgress = valuePercent() === 1 ? "complete" : "loading";
    }

    return {
      "data-progress": dataProgress,
      "data-indeterminate": local.indeterminate ? "" : undefined,
    };
  });

  const context: ProgressContextValue = {
    dataset,
    value,
    valuePercent,
    valueLabel,
    labelId,
    progressFillWidth,
    generateId: createGenerateId(() => others.id!),
    registerLabelId: createRegisterId(setLabelId),
  };

  return (
    <ProgressContext.Provider value={context}>
      <Polymorphic
        as="div"
        role="progressbar"
        aria-valuenow={local.indeterminate ? undefined : value()}
        aria-valuemin={local.minValue!}
        aria-valuemax={local.maxValue!}
        aria-valuetext={valueLabel()}
        aria-labelledby={labelId()}
        {...dataset()}
        {...others}
      />
    </ProgressContext.Provider>
  );
}
