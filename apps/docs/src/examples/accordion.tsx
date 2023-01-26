import { Accordion } from "@kobalte/core";

import { ChevronDownIcon } from "../components";
import style from "./accordion.module.css";

export function BasicExample() {
  return (
    <Accordion.Root class={style["accordion"]} defaultValue={["item-1"]} isCollapsible>
      <Accordion.Item class={style["accordion__item"]} value="item-1">
        <Accordion.Header class={style["accordion__item-header"]}>
          <Accordion.Trigger class={style["accordion__item-trigger"]}>
            <span>Is it accessible?</span>
            <ChevronDownIcon class={style["accordion__item-trigger-icon"]} aria-hidden />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class={style["accordion__item-content"]}>
          <p class={style["accordion__item-content-text"]}>
            Yes. It adheres to the WAI-ARIA design pattern.
          </p>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item class={style["accordion__item"]} value="item-2">
        <Accordion.Header class={style["accordion__item-header"]}>
          <Accordion.Trigger class={style["accordion__item-trigger"]}>
            <span>Is it unstyled?</span>
            <ChevronDownIcon class={style["accordion__item-trigger-icon"]} aria-hidden />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class={style["accordion__item-content"]}>
          <p class={style["accordion__item-content-text"]}>
            Yes. It's unstyled by default, giving you freedom over the look and feel.
          </p>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item class={style["accordion__item"]} value="item-3">
        <Accordion.Header class={style["accordion__item-header"]}>
          <Accordion.Trigger class={style["accordion__item-trigger"]}>
            <span>Can it be animated?</span>
            <ChevronDownIcon class={style["accordion__item-trigger-icon"]} aria-hidden />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class={style["accordion__item-content"]}>
          <p class={style["accordion__item-content-text"]}>
            Yes! You can animate the Accordion with CSS or JavaScript.
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
