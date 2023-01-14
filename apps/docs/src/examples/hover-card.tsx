import { HoverCard } from "@kobalte/core";

import style from "./hover-card.module.css";

export function BasicExample() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger
        class={style["hovercard__trigger"]}
        href="https://twitter.com/mlfabien"
        target="_blank"
      >
        @MLFabien
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content class={style["hovercard__content"]}>
          <HoverCard.Arrow />
          <img
            src="https://pbs.twimg.com/profile_images/1509139491671445507/pzWYjlYN_400x400.jpg"
            alt="Fabien MARIE-LOUISE"
            class={style["hovercard__avatar"]}
          />
          <h2 class={style["hovercard__title"]}>Fabien MARIE-LOUISE</h2>
          <p class={style["hovercard__description"]}>
            Developer and UI Design enthusiast. Building UI related stuffs for @solid_js
          </p>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
