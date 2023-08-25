import { createSignal, For } from "solid-js";

import { Combobox } from "../src";

interface Fruit {
  value: string;
  label: string;
  disabled: boolean;
}

const ALL_OPTIONS: Fruit[] = [
  { value: "apple", label: "Apple", disabled: false },
  { value: "banana", label: "Banana", disabled: false },
  { value: "blueberry", label: "Blueberry", disabled: false },
  { value: "grapes", label: "Grapes", disabled: true },
  { value: "pineapple", label: "Pineapple", disabled: false },
];

export default function App() {
  const [value, setValue] = createSignal<Fruit | null>(ALL_OPTIONS[0]);

  return (
    <div style={{ padding: "20px" }}>
      <p>{value()?.label}</p>
      <Combobox.Root
        value={value()}
        onChange={setValue}
        options={ALL_OPTIONS}
        optionValue="value"
        optionTextValue="label"
        optionLabel="label"
        optionDisabled="disabled"
        placeholder="Search a fruit…"
        itemComponent={props => (
          <Combobox.Item item={props.item} class="combobox__item">
            <Combobox.ItemLabel>{props.item.rawValue?.label}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class="combobox__item-indicator">X</Combobox.ItemIndicator>
          </Combobox.Item>
        )}
      >
        <Combobox.Control class="combobox__control" aria-label="Fruit">
          <Combobox.Input class="combobox__input" />
          <Combobox.Trigger class="combobox__trigger">
            <Combobox.Icon class="combobox__icon">V</Combobox.Icon>
          </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Portal>
          <Combobox.Content class="combobox__content">
            <Combobox.Listbox class="combobox__listbox" />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
      <For each={ALL_OPTIONS}>
        {option => {
          return (
            <button
              style={{
                padding: "8px",
                color: value()?.value === option.value ? "green" : "blue",
              }}
              onClick={() => {
                setValue(option);
              }}
            >
              {option.label}
            </button>
          );
        }}
      </For>
      <button
        style={{
          padding: "8px",
          color: value()?.value === null ? "green" : "blue",
        }}
        onClick={() => {
          setValue(null);
        }}
      >
        Clear
      </button>
    </div>
  );
}
