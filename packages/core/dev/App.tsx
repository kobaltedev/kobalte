import { For } from "solid-js";

import { I18nProvider, Select } from "../src";

const data = [
  "Apple",
  "Bacon",
  "Banana",
  "Broccoli",
  "Burger",
  "Cake",
  "Candy",
  "Carrot",
  "Cherry",
  "Chocolate",
  "Cookie",
  "Cucumber",
  "Donut",
  "Fish",
  "Fries",
  "Grape",
  "Green apple",
  "Hot dog",
  "Ice cream",
  "Kiwi",
  "Lemon",
  "Lollipop",
  "Onion",
  "Orange",
  "Pasta",
  "Pineapple",
  "Pizza",
  "Potato",
  "Salad",
  "Sandwich",
  "Steak",
  "Strawberry",
  "Tomato",
  "Watermelon",
];

function SelectDemo() {
  return (
    <Select>
      <Select.Trigger class="trigger">
        <Select.Value placeholder="Select a fruit" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Panel class="panel">
            <Select.Arrow />
            <Select.Listbox class="listbox">
              <For each={data}>
                {item => (
                  <Select.Option value={item} isDisabled={item === "Grape"} class="option">
                    <Select.OptionLabel>{item}</Select.OptionLabel>
                    <Select.OptionIndicator>X</Select.OptionIndicator>
                  </Select.Option>
                )}
              </For>
            </Select.Listbox>
          </Select.Panel>
        </Select.Positioner>
      </Select.Portal>
    </Select>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <SelectDemo />
    </I18nProvider>
  );
}
