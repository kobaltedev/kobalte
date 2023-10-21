import { Slider } from "@kobalte/core";
import style from "./slider.module.css";

export function BasicExample() {
  return (
    <Slider.Root class="SliderRoot" defaultValue={[0, 0]} minStepsBetweenThumbs={10}>
      <div class="SliderLabel">
        <Slider.Label>Label</Slider.Label>
        <Slider.ValueLabel></Slider.ValueLabel>
      </div>
      <Slider.Track class="SliderTrack">
        <Slider.Fill class="SliderRange" />
        <Slider.Thumb class="SliderThumb">
          <Slider.Input />
        </Slider.Thumb>
        <Slider.Thumb class="SliderThumb">
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
}
