import { MultiSelect, Select } from "@kobalte/core";
import { createSignal } from "solid-js";

import { CaretSortIcon, CheckIcon } from "../components";
import style from "./select.module.css";

const STRING_OPTIONS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

export function BasicExample() {
  return (
    <Select.Root
      options={STRING_OPTIONS}
      placeholder="Select a fruit…"
      renderValue={selectedOption => selectedOption()}
      renderItem={item => (
        <Select.Item item={item()} class={style["select__item"]}>
          <Select.ItemLabel>{item().rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value class={style["select__value"]} />
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
      renderValue={selectedOption => selectedOption()}
      renderItem={item => (
        <Select.Item item={item()} class={style["select__item"]}>
          <Select.ItemLabel>{item().rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value class={style["select__value"]} />
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
        onValueChange={setValue}
        options={STRING_OPTIONS}
        placeholder="Select a fruit…"
        renderValue={selectedOption => selectedOption()}
        renderItem={item => (
          <Select.Item item={item()} class={style["select__item"]}>
            <Select.ItemLabel>{item().rawValue}</Select.ItemLabel>
            <Select.ItemIndicator class={style["select__item-indicator"]}>
              <CheckIcon />
            </Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
          <Select.Value class={style["select__value"]} />
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

export function MultiSelectExample() {
  const [values, setValues] = createSignal(new Set(["Blueberry", "Pineapple"]));

  return (
    <>
      <MultiSelect.Root
        value={values()}
        onValueChange={setValues}
        options={STRING_OPTIONS}
        placeholder="Select some fruits…"
        renderValue={selectedOptions => selectedOptions().join(", ")}
        renderItem={item => (
          <MultiSelect.Item item={item()} class={style["select__item"]}>
            <MultiSelect.ItemLabel>{item().rawValue}</MultiSelect.ItemLabel>
            <MultiSelect.ItemIndicator class={style["select__item-indicator"]}>
              <CheckIcon />
            </MultiSelect.ItemIndicator>
          </MultiSelect.Item>
        )}
      >
        <MultiSelect.Trigger class={style["select__trigger"]} aria-label="Fruits">
          <MultiSelect.Value class={style["select__value"]} />
          <MultiSelect.Icon class={style["select__icon"]}>
            <CaretSortIcon />
          </MultiSelect.Icon>
        </MultiSelect.Trigger>
        <MultiSelect.Portal>
          <MultiSelect.Content class={style["select__content"]}>
            <MultiSelect.Listbox class={style["select__listbox"]} />
          </MultiSelect.Content>
        </MultiSelect.Portal>
      </MultiSelect.Root>
      <p class="not-prose text-sm mt-4">Your favorite fruits are: {[...values()].join(", ")}.</p>
    </>
  );
}

export function DescriptionExample() {
  return (
    <Select.Root
      options={STRING_OPTIONS}
      placeholder="Select a fruit…"
      renderValue={selectedOption => selectedOption()}
      renderItem={item => (
        <Select.Item item={item()} class={style["select__item"]}>
          <Select.ItemLabel>{item().rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value class={style["select__value"]} />
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
      onValueChange={setValue}
      validationState={value() !== "Apple" ? "invalid" : "valid"}
      options={STRING_OPTIONS}
      placeholder="Select a fruit…"
      renderValue={selectedOption => selectedOption()}
      renderItem={item => (
        <Select.Item item={item()} class={style["select__item"]}>
          <Select.ItemLabel>{item().rawValue}</Select.ItemLabel>
          <Select.ItemIndicator class={style["select__item-indicator"]}>
            <CheckIcon />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value class={style["select__value"]} />
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
        renderValue={selectedOption => selectedOption()}
        renderItem={item => (
          <Select.Item item={item()} class={style["select__item"]}>
            <Select.ItemLabel>{item().rawValue}</Select.ItemLabel>
            <Select.ItemIndicator class={style["select__item-indicator"]}>
              <CheckIcon />
            </Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.HiddenSelect />
        <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
          <Select.Value class={style["select__value"]} />
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

/*


const BASIC_OBJECT_EXAMPLE_OPTIONS = [
  { value: "apple", label: "Apple", disabled: false },
  { value: "banana", label: "Banana", disabled: false },
  { value: "blueberry", label: "Blueberry", disabled: false },
  { value: "grapes", label: "Grapes", disabled: true },
  { value: "pineapple", label: "Pineapple", disabled: false },
];

export function BasicObjectExample() {
  return (
    <Listbox.Root
      options={BASIC_OBJECT_EXAMPLE_OPTIONS}
      optionValue="value"
      optionTextValue="label"
      optionDisabled="disabled"
      class={style["listbox"]}
    >
      {items => (
        <Key each={[...items()]} by="key">
          {item => (
            <Listbox.Item item={item()} class={style["select__item"]}>
              <Listbox.ItemLabel>{item().rawValue.label}</Listbox.ItemLabel>
              <Listbox.ItemIndicator class={style["select__item-indicator"]}>
                <CheckIcon />
              </Listbox.ItemIndicator>
            </Listbox.Item>
          )}
        </Key>
      )}
    </Listbox.Root>
  );
}

interface Food {
  value: string;
  label: string;
  disabled: boolean;
}

interface Category {
  label: string;
  options: Food[];
}

const GROUP_OBJECT_EXAMPLE_OPTIONS: Category[] = [
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

export function GroupObjectExample() {
  return (
    <Listbox.Root<Food, Category>
      options={GROUP_OBJECT_EXAMPLE_OPTIONS}
      optionValue="value"
      optionTextValue="label"
      optionDisabled="disabled"
      optionGroupChildren="options"
      class={style["listbox"]}
    >
      {items => (
        <Key each={[...items()]} by="key">
          {item => (
            <Switch>
              <Match when={item().type === "section"}>
                <Listbox.Section class={style["select__section"]}>
                  {(item().rawValue as Category).label}
                </Listbox.Section>
              </Match>
              <Match when={item().type === "item"}>
                <Listbox.Item item={item()} class={style["select__item"]}>
                  <Listbox.ItemLabel>{(item().rawValue as Food).label}</Listbox.ItemLabel>
                  <Listbox.ItemIndicator class={style["select__item-indicator"]}>
                    <CheckIcon />
                  </Listbox.ItemIndicator>
                </Listbox.Item>
              </Match>
            </Switch>
          )}
        </Key>
      )}
    </Listbox.Root>
  );
}


*/
