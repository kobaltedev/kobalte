import { createSignal } from "solid-js";

import { Combobox, createFilter, I18nProvider } from "../src";
import { ComboboxTriggerMode } from "../src/combobox";

interface Food {
  value: string;
  label: string;
  disabled: boolean;
}

const RAW_OPTIONS: Food[] = [
  { value: "apple", label: "Apple", disabled: false },
  { value: "banana", label: "Banana", disabled: false },
  { value: "blueberry", label: "Blueberry", disabled: false },
  { value: "grapes", label: "Grapes", disabled: true },
  { value: "pineapple", label: "Pineapple", disabled: false },
];

export default function App() {
  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<Food[]>(RAW_OPTIONS);

  const [value, setValue] = createSignal<Food | undefined>(options()[0]);

  const onOpenChange = (isOpen: boolean, triggerMode?: ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(RAW_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    if (value === "") {
      //setValue(undefined);
    }

    setOptions(RAW_OPTIONS.filter(option => filter.contains(option.label, value)));
  };

  return (
    <I18nProvider locale="en-US">
      {value()?.label ?? "Select an option"}
      <Combobox.Root<Food>
        options={options()}
        optionValue="value"
        optionTextValue="label"
        optionLabel="label"
        optionDisabled="disabled"
        //value={value()}
        onChange={setValue}
        onInputChange={onInputChange}
        onOpenChange={onOpenChange}
        placeholder="Select a fruit..."
        itemComponent={props => (
          <Combobox.Item item={props.item} class="combobox__item">
            {props.item.rawValue.label}
            <Combobox.ItemIndicator>X</Combobox.ItemIndicator>
          </Combobox.Item>
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
