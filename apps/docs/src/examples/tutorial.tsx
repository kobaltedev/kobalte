import { Popover } from "@kobalte/core";

import style from "./tutorial.module.css";

export const PopoverDemo = () => (
  <Popover>
    <Popover.Trigger class={style["popover__trigger"]}>More info</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Content class={style["popover__content"]}>
          <Popover.Arrow class={style["popover__arrow"]} />
          Some more info…
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover>
);
