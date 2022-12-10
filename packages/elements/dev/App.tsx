import { createSignal } from "solid-js";

import { I18nProvider, Select } from "../src";

interface Food {
  id: string | number;
  label: string;
  textValue: string;
  disabled?: boolean;
}

interface Category {
  label: string;
  items: Array<Food>;
}

const FOODS_DATA: Array<Category | Food> = [
  /*
  { label: "🍎 Apple", textValue: "Apple", id: "apple" },
  { label: "🍇 Grape", textValue: "Grape", id: "grape" },
  { label: "🍊 Orange", textValue: "Orange", id: "orange" },
  { label: "🍓 Strawberry", textValue: "Strawberry", id: "strawberry" },
  { label: "🍉 Watermelon", textValue: "Watermelon", id: "watermelon" },
  */
  { label: "Zero", textValue: "Zero", id: 0 },
  { label: "Empty", textValue: "Empty", id: "" },
];

function SingleSelect() {
  const [foods, setFoods] = createSignal(FOODS_DATA);

  const [value, setValue] = createSignal<Set<string>>(new Set([]));

  return (
    <Select
      name="fruits"
      value={value()}
      onValueChange={setValue}
      options={foods()}
      optionPropertyNames={{ value: "id" }}
    >
      <div class="flex flex-col space-y-2">
        <Select.Label>Favorite fruit</Select.Label>
        <Select.Trigger class="select">
          <Select.Value placeholder="Select an option" />
          <Select.Icon class="ml-auto" />
        </Select.Trigger>
        <Select.Description>Choose wisely.</Select.Description>
        <Select.ErrorMessage>No !, you choose wrongly.</Select.ErrorMessage>
      </div>
      <Select.Portal>
        <Select.Positioner>
          <Select.Menu class="popover">
            {node => (
              <Select.Option node={node()} class="select-item">
                <Select.OptionLabel>{node().label}</Select.OptionLabel>
                <Select.OptionIndicator class="ml-auto">✓</Select.OptionIndicator>
              </Select.Option>
            )}
          </Select.Menu>
        </Select.Positioner>
      </Select.Portal>
    </Select>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <form method="get">
        <SingleSelect />
        <button>Submit</button>
      </form>
    </I18nProvider>
  );
}
