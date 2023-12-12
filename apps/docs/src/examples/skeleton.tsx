import { Image, Skeleton, ToggleButton } from "@kobalte/core";
import { createSignal } from "solid-js";

import style from "./skeleton.module.css";

export function BasicExample() {
  return (
    <Skeleton.Root class={style["skeleton"]} radius={10}>
      <p>A UI toolkit for building accessible web apps and design systems with SolidJS.</p>
    </Skeleton.Root>
  );
}

export function MultipleSkeletonsExample() {
  return (
    <div class={style["multiple-root"]}>
      <div class={style["multiple-profile"]}>
        <Skeleton.Root class={style["skeleton"]} height={50} circle>
          <Image.Root class={style["multiple-avatar"]}>
            <Image.Img
              class="image__img"
              src="https://pbs.twimg.com/profile_images/1509139491671445507/pzWYjlYN_400x400.jpg"
              alt="Nicole Steeves"
            />
          </Image.Root>
        </Skeleton.Root>
        <Skeleton.Root class={style["skeleton"]} height={20} radius={10}>
          Kobalte
        </Skeleton.Root>
      </div>
      <Skeleton.Root class={style["skeleton"]} radius={10}>
        <p>A UI toolkit for building accessible web apps and design systems with SolidJS.</p>
      </Skeleton.Root>
    </div>
  );
}

export function ToggleExample() {
  const [visible, setVisible] = createSignal(true);
  return (
    <div class={style["toggle-root"]}>
      <ToggleButton.Root class={style["toggle-button"]} pressed={visible()} onChange={setVisible}>
        Show {visible() ? "content" : "skeleton"}
      </ToggleButton.Root>
      <Skeleton.Root class={style["skeleton"]} visible={visible()}>
        <p>A UI toolkit for building accessible web apps and design systems with SolidJS.</p>
      </Skeleton.Root>
    </div>
  );
}
