import { Popover } from "@kobalte/core";
import { createSignal } from "solid-js";

import { CrossIcon } from "../components";
import style from "./popover.module.css";

export function BasicExample() {
  return (
    <Popover.Root>
      <Popover.Trigger class={style["popover__trigger"]}>Open</Popover.Trigger>
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
}

export function ControlledExample() {
  const [open, setOpen] = createSignal(false);

  return (
    <Popover.Root open={open()} onOpenChange={setOpen}>
      <Popover.Trigger class={style["popover__trigger"]}>
        {open() ? "Close" : "Open"}
      </Popover.Trigger>
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
}

export function CustomAnchorExample() {
  return (
    <Popover.Root>
      <Popover.Anchor class={style["popover__anchor"]}>
        <p>
          The popover opens when you click{" "}
          <Popover.Trigger class={style["popover__trigger"]}>here</Popover.Trigger>.
        </p>
        <p>But it's anchored to the whole div.</p>
      </Popover.Anchor>
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
}
