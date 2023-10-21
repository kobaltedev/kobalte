import { Slider } from "@kobalte/core";
import { createSignal } from "solid-js";
import style from "./slider.module.css";

export function BasicExample() {
  return (
    <Slider.Root class={style["SliderRoot"]}>
      <div class={style["SliderLabel"]}>
        <Slider.Label>Label</Slider.Label>
        <Slider.ValueLabel />
      </div>
      <Slider.Track class={style["SliderTrack"]}>
        <Slider.Fill class={style["SliderRange"]} />
        <Slider.Thumb class={style["SliderThumb"]}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
}

export function MultipleThumbsExample() {
  return (
    <Slider.Root class={style["SliderRoot"]} defaultValue={[0, 20]}>
      <div class={style["SliderLabel"]}>
        <Slider.Label>Label</Slider.Label>
        <Slider.ValueLabel />
      </div>
      <Slider.Track class={style["SliderTrack"]}>
        <Slider.Fill class={style["SliderRange"]} />
        <Slider.Thumb class={style["SliderThumb"]}>
          <Slider.Input />
        </Slider.Thumb>
        <Slider.Thumb class={`${style["SliderThumb"]} ${style["SliderThumb"]}`}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
}

export function StepExample() {
  return (
    <div class="flex flex-col space-y-4">
      <Slider.Root class={style["SliderRoot"]} step={8}>
        <div class={style["SliderLabel"]}>
          <Slider.Label>Step size 8</Slider.Label>
          <Slider.ValueLabel />
        </div>
        <Slider.Track class={style["SliderTrack"]}>
          <Slider.Fill class={style["SliderRange"]} />
          <Slider.Thumb class={style["SliderThumb"]}>
            <Slider.Input />
          </Slider.Thumb>
        </Slider.Track>
      </Slider.Root>
      <Slider.Root class={style["SliderRoot"]} step={10}>
        <div class={style["SliderLabel"]}>
          <Slider.Label>Step size 10</Slider.Label>
          <Slider.ValueLabel />
        </div>
        <Slider.Track class={style["SliderTrack"]}>
          <Slider.Fill class={style["SliderRange"]} />
          <Slider.Thumb class={style["SliderThumb"]}>
            <Slider.Input />
          </Slider.Thumb>
        </Slider.Track>
      </Slider.Root>
      <Slider.Root class={style["SliderRoot"]} step={20}>
        <div class={style["SliderLabel"]}>
          <Slider.Label>Step size 20</Slider.Label>
          <Slider.ValueLabel />
        </div>
        <Slider.Track class={style["SliderTrack"]}>
          <Slider.Fill class={style["SliderRange"]} />
          <Slider.Thumb class={style["SliderThumb"]}>
            <Slider.Input />
          </Slider.Thumb>
        </Slider.Track>
      </Slider.Root>
    </div>
  );
}

export function MinStepsBetweenExample() {
  return (
    <Slider.Root class={style["SliderRoot"]} defaultValue={[10, 20]} minStepsBetweenThumbs={10}>
      <div class={style["SliderLabel"]}>
        <Slider.Label>Label</Slider.Label>
        <Slider.ValueLabel />
      </div>
      <Slider.Track class={style["SliderTrack"]}>
        <Slider.Fill class={style["SliderRange"]} />
        <Slider.Thumb class={style["SliderThumb"]}>
          <Slider.Input />
        </Slider.Thumb>
        <Slider.Thumb class={`${style["SliderThumb"]} ${style["SliderThumb"]}`}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
}

export function VerticalSliderExample() {
  return (
    <Slider.Root class={style["SliderRoot"]} orientation="vertical">
      <div class={style["SliderLabel"]}>
        <Slider.Label>Label</Slider.Label>
        <Slider.ValueLabel />
      </div>
      <Slider.Track class={style["SliderTrack"]}>
        <Slider.Fill class={style["SliderRange"]} />
        <Slider.Thumb class={style["SliderThumb"]}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
}

export function CustomValueLabelExample() {
  return (
    <Slider.Root
      class={style["SliderRoot"]}
      minValue={10}
      maxValue={2000}
      defaultValue={[20, 500]}
      getValueLabel={params => `$${params.values[0]} - $${params.values[1]}`}
    >
      <div class={style["SliderLabel"]}>
        <Slider.Label>Money</Slider.Label>
        <Slider.ValueLabel />
      </div>
      <Slider.Track class={style["SliderTrack"]}>
        <Slider.Fill class={style["SliderRange"]} />
        <Slider.Thumb class={style["SliderThumb"]}>
          <Slider.Input />
        </Slider.Thumb>
        <Slider.Thumb class={`${style["SliderThumb"]} ${style["SliderThumb"]}`}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
}

export function ControlledExample() {
  const [values, setValues] = createSignal<number[]>([40]);
  return (
    <Slider.Root class={style["SliderRoot"]} value={values()} onChange={setValues}>
      <div class={style["SliderLabel"]}>
        <Slider.Label>Label</Slider.Label>
        <Slider.ValueLabel />
      </div>
      <Slider.Track class={style["SliderTrack"]}>
        <Slider.Fill class={style["SliderRange"]} />
        <Slider.Thumb class={style["SliderThumb"]}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
}
