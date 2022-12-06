import { createSignal, For } from "solid-js";

import { I18nProvider, ListBox } from "../src";

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

function NormalListBox() {
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

  return (
    <ListBox
      options={foods()}
      optionPropertyNames={{ value: "id" }}
      optionGroupPropertyNames={{ options: "items" }}
      class="listbox"
    >
      {collection => {
        return (
          <For each={[...collection()]}>
            {node =>
              node.type === "section" ? (
                <ListBox.Group>
                  <ListBox.GroupLabel>{node.label}</ListBox.GroupLabel>
                  <ListBox.GroupOptions>
                    <For each={[...node.childNodes]}>
                      {childNode => (
                        <ListBox.Option node={childNode} class="listbox-option">
                          <ListBox.OptionLabel>{childNode.label}</ListBox.OptionLabel>
                        </ListBox.Option>
                      )}
                    </For>
                  </ListBox.GroupOptions>
                </ListBox.Group>
              ) : (
                <ListBox.Option node={node} class="listbox-option">
                  <ListBox.OptionLabel>{node.label}</ListBox.OptionLabel>
                </ListBox.Option>
              )
            }
          </For>
        );
      }}
    </ListBox>
  );
}

function VirtualizedListBox() {
  let scrollRef: HTMLUListElement | undefined;

  const [value, setValue] = createSignal(new Set([4]));

  const options = Array.from({ length: 100 }, (_, idx) => ({
    value: idx,
    label: `Item #${idx}`,
    textValue: String(idx),
  }));

  return (
    <>
      <div>Selected values: {[...value()].join(", ")}</div>
      <ListBox
        ref={scrollRef}
        value={value()}
        onValueChange={setValue}
        isVirtualized
        options={options}
        class="listbox"
      ></ListBox>
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <VirtualizedListBox />
    </I18nProvider>
  );
}
