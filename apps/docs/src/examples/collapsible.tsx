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
      <Collapsible.Content class={style["collapsible__content"]}>
        <p class={style["collapsible__content-text"]}>
          Kobalte is a UI toolkit for building accessible web apps and design systems with SolidJS.
          It provides a set of low-level UI components and primitives which can be the foundation
          for your design system implementation.
        </p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
