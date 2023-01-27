import { Progress } from "@kobalte/core";
import { createSignal } from "solid-js";

import style from "./progress.module.css";

export function BasicExample() {
  return (
    <Progress.Root value={80} class={style["progress"]}>
      <div class={style["progress__label-container"]}>
        <Progress.Label class={style["progress__label"]}>Loading...</Progress.Label>
        <Progress.ValueLabel class={style["progress__value-label"]} />
      </div>
      <Progress.Track class={style["progress__track"]}>
        <Progress.Fill class={style["progress__fill"]} />
      </Progress.Track>
    </Progress.Root>
  );
}

export function CustomValueScaleExample() {
  return (
    <Progress.Root value={100} minValue={50} maxValue={150} class={style["progress"]}>
      <div class={style["progress__label-container"]}>
        <Progress.Label class={style["progress__label"]}>Loading...</Progress.Label>
        <Progress.ValueLabel class={style["progress__value-label"]} />
      </div>
      <Progress.Track class={style["progress__track"]}>
        <Progress.Fill class={style["progress__fill"]} />
      </Progress.Track>
    </Progress.Root>
  );
}

export function CustomValueLabelExample() {
  return (
    <Progress.Root
      value={3}
      minValue={0}
      maxValue={10}
      getValueLabel={({ value, max }) => `${value} of ${max} tasks completed`}
      class={style["progress"]}
    >
      <div class={style["progress__label-container"]}>
        <Progress.Label class={style["progress__label"]}>Processing...</Progress.Label>
        <Progress.ValueLabel class={style["progress__value-label"]} />
      </div>
      <Progress.Track class={style["progress__track"]}>
        <Progress.Fill class={style["progress__fill"]} />
      </Progress.Track>
    </Progress.Root>
  );
}
