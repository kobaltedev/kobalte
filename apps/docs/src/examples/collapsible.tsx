import { Collapsible } from "@kobalte/core";

import { ChevronDownIcon } from "../components";
import style from "./collapsible.module.css";

export function BasicExample() {
  return (
    <Collapsible.Root class={style["collapsible"]}>
      <Collapsible.Trigger class={style["collapsible__trigger"]}>
        <span>What is Kobalte ?</span>
        <ChevronDownIcon class={style["collapsible__trigger-icon"]} />
      </Collapsible.Trigger>
      <Collapsible.Content class={style["collapsible__container"]}>
        <p class={style["collapsible__content"]}>
          Kobalte is a UI toolkit for building accessible web apps and design systems with SolidJS.
          It provides a set of low-level UI components and primitives which can be the foundation
          for your design system implementation.
        </p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function AnimatingContentExample() {
  return (
    <Collapsible.Root class={style["collapsible"]} defaultIsOpen>
      <Collapsible.Trigger class={style["collapsible__trigger"]}>
        <span>What is Kobalte ?</span>
        <ChevronDownIcon class={style["collapsible__trigger-icon"]} />
      </Collapsible.Trigger>
      <Collapsible.Content class={`${style["animated"]} ${style["collapsible__container"]}`}>
        <p class={style["collapsible__content"]}>
          Kobalte is a UI toolkit for building accessible web apps and design systems with SolidJS.
          It provides a set of low-level UI components and primitives which can be the foundation
          for your design system implementation.
        </p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
