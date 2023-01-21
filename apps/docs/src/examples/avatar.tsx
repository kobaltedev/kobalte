import { Avatar } from "@kobalte/core";

import style from "./avatar.module.css";

export function BasicExample() {
  return (
    <div class="flex items-center space-x-2">
      <Avatar.Root fallbackDelay={600} class={style["avatar"]}>
        <Avatar.Image
          class={style["avatar__image"]}
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Nicole Steeves"
        />
        <Avatar.Fallback class={style["avatar__fallback"]}>NS</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root class={style["avatar"]}>
        <Avatar.Fallback class={style["avatar__fallback"]}>MD</Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
