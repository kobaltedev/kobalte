import { createSignal, For } from "solid-js";

import { I18nProvider, Listbox } from "../src";

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

function NormalListbox() {
  const initialData: Array<Category | Food> = [
    { label: "🍔 Burger", textValue: "Burger", id: "burger" },
    { label: "🍕 Pizza", textValue: "Pizza", id: "pizza" },
    { label: "🌭 Hot dog", textValue: "Hot dog", id: "hotdog" },
    {
      label: "Fruits",
      items: [
        { label: "🍎 Apple", textValue: "Apple", id: "apple" },
        { label: "🍇 Grape", textValue: "Grape", id: "grape" },
        { label: "🍊 Orange", textValue: "Orange", id: "orange" },
        { label: "🍓 Strawberry", textValue: "Strawberry", id: "strawberry" },
        { label: "🍉 Watermelon", textValue: "Watermelon", id: "watermelon" },
      ],
    },
    { label: "🧀 Cheese", textValue: "Cheese", id: "cheese" },
    {
      label: "Meats",
      items: [
        { label: "🥓 Bacon", textValue: "Bacon", id: "bacon" },
        { label: "🍗 Chicken", textValue: "Chicken", id: "chicken" },
        { label: "🥩 Steak", textValue: "Steak", id: "steak" },
      ],
    },
    { label: "🍳 Eggs", textValue: "Eggs", id: "eggs" },
    {
      label: "Vegetables",
      items: [
        { label: "🥕 Carrot", textValue: "Carrot", id: "carrot" },
        { label: "🥬 Lettuce", textValue: "Lettuce", id: "lettuce" },
        { label: "🥔 Potato", textValue: "Potato", id: "potato" },
        { label: "🍅 Tomato", textValue: "Tomato", id: "tomato" },
      ],
    },
  ];

  const [foods, setFoods] = createSignal(initialData);

  const addFood = () => {
    setFoods(prev => [
      ...prev,
      {
        label: "Pasty",
        items: [{ label: "🍰 Cake", textValue: "Cake", id: "cake" }],
      },
    ]);
  };

  return (
    <div>
      <button onClick={addFood}>Add Food</button>
      <Listbox
        options={foods()}
        optionPropertyNames={{ value: "id" }}
        optionGroupPropertyNames={{ options: "items" }}
        class="listbox"
      >
        {node =>
          node().type === "section" ? (
            <Listbox.Group node={node()}>
              <Listbox.GroupLabel>{node().label}</Listbox.GroupLabel>
              <Listbox.GroupOptions>
                {childNode => (
                  <Listbox.Option node={childNode()} class="listbox-option">
                    <Listbox.OptionLabel>{childNode().label}</Listbox.OptionLabel>
                  </Listbox.Option>
                )}
              </Listbox.GroupOptions>
            </Listbox.Group>
          ) : (
            <Listbox.Option node={node()} class="listbox-option">
              <Listbox.OptionLabel>{node().label}</Listbox.OptionLabel>
            </Listbox.Option>
          )
        }
      </Listbox>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <NormalListbox />
    </I18nProvider>
  );
}
