import { Popover } from "@kobalte/core";

import { CrossIcon } from "../components";
import style from "./popover.module.css";

export const PopoverDemo = () => (
  <Popover.Root>
    <Popover.Trigger class={style["popover__trigger"]}>Learn more</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content class={style["popover__content"]}>
        <Popover.Arrow />
        <div class={style["popover__header"]}>
          <Popover.Title class={style["popover__title"]}>About Kobalte</Popover.Title>
          <Popover.CloseButton class={style["popover__close-button"]}>
            <CrossIcon />
          </Popover.CloseButton>
        </div>
        <Popover.Description class={style["popover__description"]}>
          A UI toolkit for building accessible web apps and design systems with SolidJS.
        </Popover.Description>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);
