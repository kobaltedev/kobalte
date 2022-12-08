import { createSignal } from "solid-js";

import { I18nProvider, Select } from "../src";

interface Food {
  id: string;
  label: string;
  textValue: string;
  disabled?: boolean;
}

interface Category {
  label: string;
  items: Array<Food>;
}

const FOODS_DATA: Array<Category | Food> = [
  { label: "🍎 Apple", textValue: "Apple", id: "apple" },
  { label: "🍇 Grape", textValue: "Grape", id: "grape" },
  { label: "🍊 Orange", textValue: "Orange", id: "orange" },
  { label: "🍓 Strawberry", textValue: "Strawberry", id: "strawberry" },
  { label: "🍉 Watermelon", textValue: "Watermelon", id: "watermelon" },
];

function SingleSelect() {
  const [foods, setFoods] = createSignal(FOODS_DATA);

  const [value, setValue] = createSignal<Set<string>>(new Set([]));

  return (
    <Select
      value={value()}
      onValueChange={setValue}
      options={foods()}
      optionPropertyNames={{ value: "id" }}
    >
      <Select.Trigger class="select">
        <Select.Value placeholder="Select an option" />
        <Select.Icon class="ml-auto" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Panel class="popover">
            <Select.Arrow />
            <Select.Menu>
              {node => (
                <Select.Option node={node()} class="select-item">
                  <Select.OptionLabel>{node().label}</Select.OptionLabel>
                  <Select.OptionIndicator class="ml-auto">✓</Select.OptionIndicator>
                </Select.Option>
              )}
            </Select.Menu>
          </Select.Panel>
        </Select.Positioner>
      </Select.Portal>
    </Select>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <SingleSelect />
    </I18nProvider>
  );
}
