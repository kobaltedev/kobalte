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
    <I18nProvider locale="en-US">
      <MultiCombobox.Root
        placeholder="Select some animal"
        options={filteredOptions()}
        optionValue="id"
        optionTextValue="name"
        onInputChange={setQuery}
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
          {({ values }) => (
            <>
              <span>
                {optionList
                  .filter(option => values().includes(option.id))
                  .map(option => option.name)
                  .join(", ")}
              </span>
              <MultiCombobox.Input />
              <MultiCombobox.Button class="combobox__button">V</MultiCombobox.Button>
            </>
          )}
        </MultiCombobox.Trigger>
        <MultiCombobox.Portal>
          <MultiCombobox.Content class="combobox__content">
            <MultiCombobox.Listbox class="combobox__listbox" />
          </MultiCombobox.Content>
        </MultiCombobox.Portal>
      </MultiCombobox.Root>
      <Combobox.Root
        placeholder="Select an animal"
        options={filteredOptions()}
        optionValue="id"
        optionTextValue="name"
        onInputChange={setQuery}
        itemComponent={props => (
          <Combobox.Item item={props.item} class="combobox__item">
            <Combobox.ItemLabel>{props.item.rawValue.name}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class="combobox__item-indicator">X</Combobox.ItemIndicator>
          </Combobox.Item>
        )}
      >
        <Combobox.Trigger class="combobox__trigger">
          <MultiCombobox.Input />
          <MultiCombobox.Button class="combobox__button">V</MultiCombobox.Button>
        </Combobox.Trigger>
        <Combobox.Portal>
          <Combobox.Content class="combobox__content">
            <Combobox.Listbox class="combobox__listbox" />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
    </I18nProvider>
  );
}
