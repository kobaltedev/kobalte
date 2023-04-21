import { createSignal } from "solid-js";

import { Combobox, I18nProvider } from "../src";

interface Food {
  value: string;
  label: string;
  disabled: boolean;
}

const options: Food[] = [
  { value: "apple", label: "Apple", disabled: false },
  { value: "banana", label: "Banana", disabled: false },
  { value: "blueberry", label: "Blueberry", disabled: false },
  { value: "grapes", label: "Grapes", disabled: true },
  { value: "pineapple", label: "Pineapple", disabled: false },
];

export default function App() {
  const [value, setValue] = createSignal<Food>(options[0]);

  return (
    <I18nProvider locale="en-US">
      <Combobox.Root
        options={options}
        optionValue="value"
        optionTextValue="label"
        optionLabel="label"
        optionDisabled="disabled"
        value={value()}
        //onChange={setValue}
        placeholder="Select a fruit..."
        itemComponent={props => (
          <Combobox.Item item={props.item} class="combobox__item">
            {props.item.rawValue.label}
          </Combobox.Item>
        )}
        sectionComponent={props => (
          <Combobox.Section class="combobox__section">
            {props.section.rawValue.label}
          </Combobox.Section>
        )}
      >
        <Combobox.Control<Food> class="combobox__trigger">
          <Combobox.Input />
          <Combobox.Trigger class="combobox__icon" />
        </Combobox.Control>
        <Combobox.Portal>
          <Combobox.Content class="combobox__content">
            <Combobox.Listbox class="combobox__listbox" />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
    </I18nProvider>
  );
}

/*




*/
