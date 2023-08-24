import { createSignal } from "solid-js";

import { Select } from "../src";

export default function App() {
  const [value, setValue] = createSignal("Blueberry");

  return (
    <>
      <Select.Root
        value={value()}
        onChange={setValue}
        options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
        placeholder="Select a fruit…"
        itemComponent={props => (
          <Select.Item item={props.item} class="select__item">
            <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
            <Select.ItemIndicator class="select__item-indicator">X</Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.Trigger class="select__trigger" aria-label="Fruit">
          <Select.Value<string> class="select__value">
            {state => state.selectedOption()}
          </Select.Value>
          <Select.Icon class="select__icon">V</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class="select__content">
            <Select.Listbox class="select__listbox" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <p>Your favorite fruit is: {value()}.</p>
    </>
  );
}
