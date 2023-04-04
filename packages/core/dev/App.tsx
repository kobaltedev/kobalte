import { createMemo, createSignal } from "solid-js";

import { Combobox, createFilter, I18nProvider, MultiCombobox } from "../src";

const optionList = [
  { name: "Red Panda", id: "1" },
  { name: "Cat", id: "2" },
  { name: "Dog", id: "3" },
  { name: "Aardvark", id: "4" },
  { name: "Kangaroo", id: "5" },
  { name: "Snake", id: "6" },
  { name: "Duck", id: "7" },
];

export default function App() {
  const [query, setQuery] = createSignal("");

  const { contains } = createFilter({ sensitivity: "base" });

  const filteredOptions = createMemo(() => {
    return optionList.filter(item => contains(item.name, query()));
  });

  return (
    <I18nProvider>
      <MultiCombobox.Root
        options={filteredOptions()}
        optionValue="id"
        optionTextValue="name"
        onInputChange={setQuery}
        valueComponent={props =>
          optionList
            .filter(option => props.values.includes(option.id))
            .map(option => option.name)
            .join(", ")
        }
        itemComponent={props => (
          <MultiCombobox.Item item={props.item} class="combobox__item">
            <MultiCombobox.ItemLabel>{props.item.rawValue.name}</MultiCombobox.ItemLabel>
            <MultiCombobox.ItemIndicator class="combobox__item-indicator">
              X
            </MultiCombobox.ItemIndicator>
          </MultiCombobox.Item>
        )}
      >
        <MultiCombobox.Trigger class="combobox__trigger">
          <MultiCombobox.Value />
          <MultiCombobox.Input />
          <MultiCombobox.Button class="combobox__button">V</MultiCombobox.Button>
        </MultiCombobox.Trigger>
        <MultiCombobox.Portal>
          <MultiCombobox.Content class="combobox__content">
            <MultiCombobox.Listbox class="combobox__listbox" />
          </MultiCombobox.Content>
        </MultiCombobox.Portal>
      </MultiCombobox.Root>
    </I18nProvider>
  );
}
