import { Combobox, createFilter } from "@kobalte/core";
import { createSignal } from "solid-js";

import { CaretSortIcon, CheckIcon } from "../components";
import style from "./combobox.module.css";

const ALL_STRING_OPTIONS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

export function BasicExample() {
  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<string[]>(ALL_STRING_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_STRING_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    setOptions(ALL_STRING_OPTIONS.filter(option => filter.contains(option, value)));
  };

  return (
    <Combobox.Root
      options={options()}
      onInputChange={onInputChange}
      onOpenChange={onOpenChange}
      placeholder="Search a fruit…"
      itemComponent={props => (
        <Combobox.Item item={props.item} class={style["combobox__item"]}>
          <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
          <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
            <CheckIcon />
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
    >
      <Combobox.Control class={style["combobox__control"]} aria-label="Fruit">
        <Combobox.Input class={style["combobox__input"]} />
        <Combobox.Trigger class={style["combobox__trigger"]}>
          <Combobox.Icon class={style["combobox__icon"]}>
            <CaretSortIcon />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Portal>
        <Combobox.Content class={style["combobox__content"]}>
          <Combobox.Listbox class={style["combobox__listbox"]} />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
