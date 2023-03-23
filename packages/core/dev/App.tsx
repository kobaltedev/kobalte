import { I18nProvider, Select } from "../src";

export default function App() {
  return (
    <I18nProvider>
      <input value="I am input" />
      <Select.Root
        options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
        placeholder="Select a fruit…"
        valueComponent={props => props.item.rawValue}
        itemComponent={props => (
          <Select.Item item={props.item} class="select__item">
            <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
          </Select.Item>
        )}
      >
        <Select.Trigger class="select__trigger" aria-label="Fruit">
          <Select.Value class="select__value" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class="select__content">
            <Select.Listbox class="select__listbox" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <input value="I am input" />
    </I18nProvider>
  );
}
