import { createVirtualizer, elementScroll, VirtualizerOptions } from "@tanstack/solid-virtual";
import { createSignal, For } from "solid-js";

import { CollectionItem, createDataSource, I18nProvider, ListBox } from "../src";

interface Food {
  id: string;
  label: string;
  textValue: string;
  disabled?: boolean;
}

interface Category {
  id: string;
  label: string;
  items: Array<Food>;
}

function NormalListBox() {
  const initialData: Array<Category | Food> = [
    { label: "🍔 Burger", textValue: "Burger", id: "burger" },
    { label: "🍕 Pizza", textValue: "Pizza", id: "pizza" },
    { label: "🌭 Hot dog", textValue: "Hot dog", id: "hotdog" },
    {
      id: "fruits",
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
      id: "meats",
      label: "Meats",
      items: [
        { label: "🥓 Bacon", textValue: "Bacon", id: "bacon" },
        { label: "🍗 Chicken", textValue: "Chicken", id: "chicken" },
        { label: "🥩 Steak", textValue: "Steak", id: "steak" },
      ],
    },
    { label: "🍳 Eggs", textValue: "Eggs", id: "eggs" },
    {
      id: "vegetables",
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

  const dataSource = createDataSource<Food, Category>({
    data: foods,
    getItem: food => ({
      id: food.id,
      label: food.label,
      textValue: food.textValue,
      disabled: food.disabled,
    }),
    getSection: category => ({
      id: category.id,
      label: category.label,
      items: category.items,
    }),
  });

  return (
    <ListBox dataSource={dataSource} class="listbox">
      {collection => {
        console.log(collection());
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

  const [value, setValue] = createSignal<"all" | Set<string>>(new Set<string>([]));

  const dataSource = createDataSource<CollectionItem>({
    data: () =>
      Array.from({ length: 100_000 }, (_, idx) => ({
        id: String(idx),
        label: `Item #${idx}`,
        textValue: String(idx),
      })),
  });

  const rowVirtualizer = createVirtualizer({
    count: dataSource.data().length,
    getScrollElement: () => scrollRef,
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <>
      <div>Selected values: {value() === "all" ? "all" : [...value()].join(", ")}</div>
      <ListBox
        ref={scrollRef}
        value={value()}
        onValueChange={setValue}
        selectionMode="multiple"
        isVirtualized
        dataSource={dataSource}
        scrollToIndex={rowVirtualizer.scrollToIndex}
        class="listbox"
      >
        {collection => (
          <div
            role="presentation"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            <For each={rowVirtualizer.getVirtualItems()}>
              {virtualRow => {
                const node = collection().at(virtualRow.index);

                if (!node) {
                  return;
                }

                return (
                  <ListBox.Option
                    node={node}
                    class="listbox-option"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <ListBox.OptionLabel>{node.label}</ListBox.OptionLabel>
                    <ListBox.OptionIndicator class="ml-auto">✅</ListBox.OptionIndicator>
                  </ListBox.Option>
                );
              }}
            </For>
          </div>
        )}
      </ListBox>
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
