import { For } from "solid-js";

import { I18nProvider, ListBox } from "../src";

interface Food {
  id: string;
  label: string;
  textValue: string;
  disabled?: boolean;
}

interface Category {
  label: string;
  foods: Array<Food>;
}

const foods: Array<Category> = [
  {
    label: "Fruits",
    foods: [
      { label: "🍎 Apple", textValue: "Apple", id: "apple" },
      { label: "🍇 Grape", textValue: "Grape", id: "grape" },
      { label: "🍊 Orange", textValue: "Orange", id: "orange" },
      { label: "🍓 Strawberry", textValue: "Strawberry", id: "strawberry" },
      { label: "🍉 Watermelon", textValue: "Watermelon", id: "watermelon" },
    ],
  },
  {
    label: "Meats",
    foods: [
      { label: "🥓 Bacon", textValue: "Bacon", id: "bacon" },
      { label: "🍗 Chicken", textValue: "Chicken", id: "chicken" },
      { label: "🥩 Steak", textValue: "Steak", id: "steak" },
    ],
  },
  {
    label: "Vegetables",
    foods: [
      { label: "🥕 Carrot", textValue: "Carrot", id: "carrot" },
      { label: "🥬 Lettuce", textValue: "Lettuce", id: "lettuce" },
      { label: "🥔 Potatoe", textValue: "Potatoe", id: "potatoe" },
      { label: "🍅 Tomato", textValue: "Tomato", id: "tomato" },
    ],
  },
];

export default function App() {
  return (
    <I18nProvider>
      <ListBox class="listbox space-y-2">
        <For each={foods}>
          {category => (
            <ListBox.Group class="group">
              <ListBox.GroupLabel class="text-sm text-gray-500 px-2">
                {category.label}
              </ListBox.GroupLabel>
              <ListBox.GroupOptions class="group-options">
                <For each={category.foods}>
                  {food => (
                    <ListBox.Option
                      class="listbox-item flex items-center"
                      value={food.id}
                      textValue={food.textValue}
                      isDisabled={food.disabled}
                    >
                      <ListBox.OptionLabel>{food.label}</ListBox.OptionLabel>
                      <ListBox.OptionIndicator class="ml-auto">✅</ListBox.OptionIndicator>
                    </ListBox.Option>
                  )}
                </For>
              </ListBox.GroupOptions>
            </ListBox.Group>
          )}
        </For>
      </ListBox>
    </I18nProvider>
  );
}
