import { Collection, CollectionNode, I18nProvider, Select } from "@kobalte/core";
import { createVirtualizer } from "@tanstack/solid-virtual";
import { Accessor, For, Match, Switch } from "solid-js";

const generateItems = (n: number) => {
  const ret = [];

  for (let i = 0; i < n; i++) {
    ret.push({
      id: `item-${i}`,
      textValue: `item-${i}`,
      label: `item-${i}`,
      disabled: false,
    });
  }

  return ret;
};

export default function App() {
  const data = generateItems(100_000);
  let listboxRef: HTMLUListElement | undefined;

  return (
    <I18nProvider>
      <Select.Root
        options={data}
        optionValue="id"
        optionTextValue="textValue"
        optionDisabled="disabled"
        isVirtualized
      >
        <Select.Trigger class="select__trigger m-4" aria-label="Food">
          <Select.Value class="select__value" placeholder="Select an item…">
            {({ selectedItem }) => selectedItem().rawValue.label}
          </Select.Value>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class="select__content">
            {() => {
              const rowVirtualizer = createVirtualizer({
                count: data.length,
                getScrollElement: () => listboxRef,
                getItemKey: (index: number) => data[index].id,
                estimateSize: () => 35,
                enableSmoothScroll: false,
                overscan: 5,
              });

              return (
                <Select.Listbox
                  class="select__listbox"
                  ref={listboxRef}
                  scrollToKey={key => {
                    rowVirtualizer.scrollToIndex(data.findIndex(item => item.id === key));
                  }}
                  style={{ height: "200px", overflow: "auto" }}
                >
                  {collection => {
                    return (
                      <div
                        style={{
                          height: `${rowVirtualizer.getTotalSize()}px`,
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <For each={rowVirtualizer.getVirtualItems()}>
                          {virtualRow => {
                            const item = collection().getItem(virtualRow.key)!;

                            return (
                              <Select.Item
                                item={item}
                                class="select__item"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: `${virtualRow.size}px`,
                                  transform: `translateY(${virtualRow.start}px)`,
                                }}
                              >
                                <Select.ItemLabel>{item.rawValue.label}</Select.ItemLabel>
                                <Select.ItemIndicator class="select__item-indicator">
                                  X
                                </Select.ItemIndicator>
                              </Select.Item>
                            );
                          }}
                        </For>
                      </div>
                    );
                  }}
                </Select.Listbox>
              );
            }}
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </I18nProvider>
  );
}

/*

{items => (
  <Key each={[...items()]} by="key">
    {(item, index) => (
      <Switch>
        <Match when={item().type === "section"}>
          <Select.Section class="select__group-label">
            {item().rawValue.label}
          </Select.Section>
        </Match>
        <Match when={item().type === "item"}>
          <Select.Item item={item()} class="select__item">
            <Select.ItemLabel>{item().rawValue.label}</Select.ItemLabel>
            <Select.ItemIndicator class="select__item-indicator">X</Select.ItemIndicator>
          </Select.Item>
        </Match>
      </Switch>
    )}
  </Key>
)}

*/
