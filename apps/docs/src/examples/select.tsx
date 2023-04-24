import { As, Select } from "@kobalte/core";
import { createVirtualizer } from "@tanstack/solid-virtual";
import { createSignal, For } from "solid-js";

import { CaretSortIcon, CheckIcon, CrossIcon } from "../components";
import style from "./select.module.css";

const STRING_OPTIONS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

export function BasicExample() {
  return (
    <Select.Root
      options={STRING_OPTIONS}
      placeholder="Select a fruit…"
      itemComponent={props => (
        <Select.Item item={props.item} class={style["select__item"]}>
          <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value<string> class={style["select__value"]}>
          {state => state.selectedOption()}
        </Select.Value>
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]} />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function DefaultValueExample() {
  return (
    <Select.Root
      defaultValue="Blueberry"
      options={STRING_OPTIONS}
      placeholder="Select a fruit…"
      itemComponent={props => (
        <Select.Item item={props.item} class={style["select__item"]}>
          <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value<string> class={style["select__value"]}>
          {state => state.selectedOption()}
        </Select.Value>
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]} />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function ControlledExample() {
  const [value, setValue] = createSignal("Blueberry");

  return (
    <>
      <Select.Root
        value={value()}
        onChange={setValue}
        options={STRING_OPTIONS}
        placeholder="Select a fruit…"
        itemComponent={props => (
          <Select.Item item={props.item} class={style["select__item"]}>
            <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
            <Select.ItemIndicator class={style["select__item-indicator"]}>
              <CheckIcon />
            </Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
          <Select.Value<string> class={style["select__value"]}>
            {state => state.selectedOption()}
          </Select.Value>
          <Select.Icon class={style["select__icon"]}>
            <CaretSortIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class={style["select__content"]}>
            <Select.Listbox class={style["select__listbox"]} />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <p class="not-prose text-sm mt-4">Your favorite fruit is: {value()}.</p>
    </>
  );
}

export function DescriptionExample() {
  return (
    <Select.Root
      options={STRING_OPTIONS}
      placeholder="Select a fruit…"
      itemComponent={props => (
        <Select.Item item={props.item} class={style["select__item"]}>
          <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value<string> class={style["select__value"]}>
          {state => state.selectedOption()}
        </Select.Value>
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Description class={style["select__description"]}>
        Choose the fruit you like the most.
      </Select.Description>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]} />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function ErrorMessageExample() {
  const [value, setValue] = createSignal("Grapes");

  return (
    <Select.Root
      value={value()}
      onChange={setValue}
      validationState={value() !== "Apple" ? "invalid" : "valid"}
      options={STRING_OPTIONS}
      placeholder="Select a fruit…"
      itemComponent={props => (
        <Select.Item item={props.item} class={style["select__item"]}>
          <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value<string> class={style["select__value"]}>
          {state => state.selectedOption()}
        </Select.Value>
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.ErrorMessage class={style["select__error-message"]}>
        Hmm, I prefer apples.
      </Select.ErrorMessage>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]} />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function HTMLFormExample() {
  let formRef: HTMLFormElement | undefined;

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(formRef);

    alert(JSON.stringify(Object.fromEntries(formData), null, 2));
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} class="flex flex-col items-center space-y-6">
      <Select.Root
        name="fruit"
        options={STRING_OPTIONS}
        placeholder="Select a fruit…"
        itemComponent={props => (
          <Select.Item item={props.item} class={style["select__item"]}>
            <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
            <Select.ItemIndicator class={style["select__item-indicator"]}>
              <CheckIcon />
            </Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.HiddenSelect />
        <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
          <Select.Value<string> class={style["select__value"]}>
            {state => state.selectedOption()}
          </Select.Value>
          <Select.Icon class={style["select__icon"]}>
            <CaretSortIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class={style["select__content"]}>
            <Select.Listbox class={style["select__listbox"]} />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <div class="flex space-x-2">
        <button type="reset" class="kb-button">
          Reset
        </button>
        <button class="kb-button-primary">Submit</button>
      </div>
    </form>
  );
}

interface Food {
  value: string;
  label: string;
  disabled: boolean;
}

const OBJECT_OPTIONS: Food[] = [
  { value: "apple", label: "Apple", disabled: false },
  { value: "banana", label: "Banana", disabled: false },
  { value: "blueberry", label: "Blueberry", disabled: false },
  { value: "grapes", label: "Grapes", disabled: true },
  { value: "pineapple", label: "Pineapple", disabled: false },
];

export function ObjectExample() {
  return (
    <Select.Root
      options={OBJECT_OPTIONS}
      optionValue="value"
      optionTextValue="label"
      optionDisabled="disabled"
      placeholder="Select a food…"
      itemComponent={props => (
        <Select.Item item={props.item} class={style["select__item"]}>
          <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Food">
        <Select.Value<Food> class={style["select__value"]}>
          {state => state.selectedOption().label}
        </Select.Value>
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]} />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

interface Category {
  label: string;
  options: Food[];
}

const GROUP_OBJECT_OPTIONS: Category[] = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple", disabled: false },
      { value: "banana", label: "Banana", disabled: false },
      { value: "blueberry", label: "Blueberry", disabled: false },
      { value: "grapes", label: "Grapes", disabled: true },
      { value: "pineapple", label: "Pineapple", disabled: false },
    ],
  },
  {
    label: "Meat",
    options: [
      { value: "beef", label: "Beef", disabled: false },
      { value: "chicken", label: "Chicken", disabled: false },
      { value: "lamb", label: "Lamb", disabled: false },
      { value: "pork", label: "Pork", disabled: false },
    ],
  },
];

export function OptionGroupExample() {
  return (
    <Select.Root<Food, Category>
      options={GROUP_OBJECT_OPTIONS}
      optionValue="value"
      optionTextValue="label"
      optionDisabled="disabled"
      optionGroupChildren="options"
      placeholder="Select a food…"
      itemComponent={props => (
        <Select.Item item={props.item} class={style["select__item"]}>
          <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
      sectionComponent={props => (
        <Select.Section class={style["select__section"]}>
          {props.section.rawValue.label}
        </Select.Section>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Food">
        <Select.Value<Food> class={style["select__value"]}>
          {state => state.selectedOption().label}
        </Select.Value>
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]} />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function MultipleSelectionExample() {
  const [values, setValues] = createSignal(["Blueberry", "Grapes"]);

  return (
    <>
      <Select.Root<string>
        multiple
        value={values()}
        onChange={setValues}
        options={STRING_OPTIONS}
        placeholder="Select some fruits…"
        itemComponent={props => (
          <Select.Item item={props.item} class={style["select__item"]}>
            <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
            <Select.ItemIndicator class={style["select__item-indicator"]}>
              <CheckIcon />
            </Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.Trigger
          class={`${style["select__trigger"]} ${style["select__trigger_multi"]}`}
          aria-label="Fruits"
          asChild
        >
          <As component="div">
            <Select.Value<string> class={style["select__value"]}>
              {state => (
                <>
                  <div class="flex items-center gap-2 flex-wrap">
                    <For each={state.selectedOptions()}>
                      {option => (
                        <span
                          class="bg-zinc-100 dark:bg-zinc-700 text-sm px-2 py-0.5 rounded inline-flex items-center gap-x-2"
                          onPointerDown={e => e.stopPropagation()}
                        >
                          {option}
                          <button
                            onClick={() => state.remove(option)}
                            class="rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-600 p-1"
                          >
                            <CrossIcon class="h3 w-3" />
                          </button>
                        </span>
                      )}
                    </For>
                  </div>
                  <button
                    onPointerDown={e => e.stopPropagation()}
                    onClick={state.clear}
                    class="ml-auto mr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-600 p-1"
                  >
                    <CrossIcon class="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </Select.Value>
            <Select.Icon class={style["select__icon"]}>
              <CaretSortIcon />
            </Select.Icon>
          </As>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class={style["select__content"]}>
            <Select.Listbox class={style["select__listbox"]} />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <p class="not-prose text-sm mt-4">Your favorite fruits are: {values().join(", ")}.</p>
    </>
  );
}

interface Item {
  value: string;
  label: string;
  disabled: boolean;
}

function SelectContent(props: { options: Item[] }) {
  let listboxRef: HTMLUListElement | undefined;

  const virtualizer = createVirtualizer({
    count: props.options.length,
    getScrollElement: () => listboxRef,
    getItemKey: (index: number) => props.options[index].value,
    estimateSize: () => 32,
    enableSmoothScroll: false,
    overscan: 5,
  });

  return (
    <Select.Content class={style["select__content"]}>
      <Select.Listbox
        ref={listboxRef}
        scrollToItem={key =>
          virtualizer.scrollToIndex(props.options.findIndex(option => option.value === key))
        }
        class={style["select__listbox"]}
        style={{ height: "200px", width: "100%", overflow: "auto" }}
      >
        {items => (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            <For each={virtualizer.getVirtualItems()}>
              {virtualRow => {
                const item = items().getItem(virtualRow.key);

                if (item) {
                  return (
                    <Select.Item
                      item={item}
                      class={style["select__item"]}
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
                      <Select.ItemIndicator class={style["select__item-indicator"]}>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }
              }}
            </For>
          </div>
        )}
      </Select.Listbox>
    </Select.Content>
  );
}

export function VirtualizedExample() {
  const options: Item[] = Array.from({ length: 100_000 }, (_, i) => ({
    value: `${i}`,
    label: `Item #${i + 1}`,
    disabled: false,
  }));

  return (
    <Select.Root
      virtualized
      options={options}
      optionValue="value"
      optionTextValue="label"
      optionDisabled="disabled"
      placeholder="Select an item…"
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Food">
        <Select.Value<Item> class={style["select__value"]}>
          {state => state.selectedOption().label}
        </Select.Value>
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <SelectContent options={options} />
      </Select.Portal>
    </Select.Root>
  );
}
