import { Popover } from "@kobalte/core";
import { createSignal } from "solid-js";

import { CrossIcon } from "../components";
import style from "./popover.module.css";

export function BasicExample() {
  return (
    <Popover>
      <Popover.Trigger class={style["popover__trigger"]}>Open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
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
        </Popover.Positioner>
      </Popover.Portal>
    </Popover>
  );
}

export function ControlledExample() {
  const [open, setOpen] = createSignal(false);

  return (
    <Popover isOpen={open()} onOpenChange={setOpen}>
      <Popover.Trigger class={style["popover__trigger"]}>
        {open() ? "Close" : "Open"}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
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
        </Popover.Positioner>
      </Popover.Portal>
    </Popover>
  );
}
