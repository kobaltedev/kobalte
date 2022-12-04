import { createMemo, createSignal, For } from "solid-js";

import { I18nProvider, ListBox, Popover } from "../src";

interface Fruit {
  id: string;
  label: string;
  textValue: string;
  disabled?: boolean;
}

const dataSource: Array<Fruit> = [
  { label: "🍎 Apple", textValue: "Apple", id: "apple" },
  { label: "🍇 Grape", textValue: "Grape", id: "grape" },
  { label: "🍊 Orange", textValue: "Orange", id: "orange" },
  { label: "🍓 Strawberry", textValue: "Strawberry", id: "strawberry" },
  { label: "🍉 Watermelon", textValue: "Watermelon", id: "watermelon" },
];

export default function App() {
  return (
    <I18nProvider>
      <ListBox class="popover" shouldFocusOnHover>
        <For each={dataSource}>
          {item => (
            <ListBox.Option
              class="combobox-item"
              value={item.id}
              textValue={item.textValue}
              isDisabled={item.disabled}
            >
              <ListBox.OptionLabel>{item.label}</ListBox.OptionLabel>
              <ListBox.OptionDescription>{item.id}</ListBox.OptionDescription>
            </ListBox.Option>
          )}
        </For>
      </ListBox>
    </I18nProvider>
  );
}
