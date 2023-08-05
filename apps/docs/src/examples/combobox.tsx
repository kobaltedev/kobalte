import { Combobox, createFilter } from "@kobalte/core";
import { createSignal, For } from "solid-js";

import { CaretSortIcon, CheckIcon, CrossIcon } from "../components";
import style from "./combobox.module.css";

const ALL_STRING_OPTIONS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

export function BasicExample() {
  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<string[]>(ALL_STRING_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_STRING_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    setOptions(ALL_STRING_OPTIONS.filter(option => filter.contains(option, value)));
  };

  return (
    <Combobox.Root
      options={options()}
      onInputChange={onInputChange}
      onOpenChange={onOpenChange}
      placeholder="Search a fruit…"
      itemComponent={props => (
        <Combobox.Item item={props.item} class={style["combobox__item"]}>
          <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
          <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
            <CheckIcon />
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
    >
      <Combobox.Control class={style["combobox__control"]} aria-label="Fruit">
        <Combobox.Input class={style["combobox__input"]} />
        <Combobox.Trigger class={style["combobox__trigger"]}>
          <Combobox.Icon class={style["combobox__icon"]}>
            <CaretSortIcon />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Portal>
        <Combobox.Content class={style["combobox__content"]}>
          <Combobox.Listbox class={style["combobox__listbox"]} />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export function DefaultValueExample() {
  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<string[]>(ALL_STRING_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_STRING_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    setOptions(ALL_STRING_OPTIONS.filter(option => filter.contains(option, value)));
  };

  return (
    <Combobox.Root
      defaultValue="Blueberry"
      options={options()}
      onInputChange={onInputChange}
      onOpenChange={onOpenChange}
      placeholder="Search a fruit…"
      itemComponent={props => (
        <Combobox.Item item={props.item} class={style["combobox__item"]}>
          <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
          <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
            <CheckIcon />
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
    >
      <Combobox.Control class={style["combobox__control"]} aria-label="Fruit">
        <Combobox.Input class={style["combobox__input"]} />
        <Combobox.Trigger class={style["combobox__trigger"]}>
          <Combobox.Icon class={style["combobox__icon"]}>
            <CaretSortIcon />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Portal>
        <Combobox.Content class={style["combobox__content"]}>
          <Combobox.Listbox class={style["combobox__listbox"]} />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export function ControlledExample() {
  const [value, setValue] = createSignal("Blueberry");

  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<string[]>(ALL_STRING_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_STRING_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    // Remove selection when input is cleared.
    if (value === "") {
      setValue("");
    }

    setOptions(ALL_STRING_OPTIONS.filter(option => filter.contains(option, value)));
  };

  return (
    <>
      <Combobox.Root
        options={options()}
        value={value()}
        onChange={setValue}
        onInputChange={onInputChange}
        onOpenChange={onOpenChange}
        placeholder="Search a fruit…"
        itemComponent={props => (
          <Combobox.Item item={props.item} class={style["combobox__item"]}>
            <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
              <CheckIcon />
            </Combobox.ItemIndicator>
          </Combobox.Item>
        )}
      >
        <Combobox.Control class={style["combobox__control"]} aria-label="Fruit">
          <Combobox.Input class={style["combobox__input"]} />
          <Combobox.Trigger class={style["combobox__trigger"]}>
            <Combobox.Icon class={style["combobox__icon"]}>
              <CaretSortIcon />
            </Combobox.Icon>
          </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Portal>
          <Combobox.Content class={style["combobox__content"]}>
            <Combobox.Listbox class={style["combobox__listbox"]} />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
      <p class="not-prose text-sm mt-4">Your favorite fruit is: {value()}.</p>
    </>
  );
}

export function DescriptionExample() {
  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<string[]>(ALL_STRING_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_STRING_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    setOptions(ALL_STRING_OPTIONS.filter(option => filter.contains(option, value)));
  };

  return (
    <Combobox.Root
      options={options()}
      onInputChange={onInputChange}
      onOpenChange={onOpenChange}
      placeholder="Search a fruit…"
      itemComponent={props => (
        <Combobox.Item item={props.item} class={style["combobox__item"]}>
          <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
          <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
            <CheckIcon />
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
    >
      <Combobox.Control class={style["combobox__control"]} aria-label="Fruit">
        <Combobox.Input class={style["combobox__input"]} />
        <Combobox.Trigger class={style["combobox__trigger"]}>
          <Combobox.Icon class={style["combobox__icon"]}>
            <CaretSortIcon />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Description class={style["combobox__description"]}>
        Choose the fruit you like the most.
      </Combobox.Description>
      <Combobox.Portal>
        <Combobox.Content class={style["combobox__content"]}>
          <Combobox.Listbox class={style["combobox__listbox"]} />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export function ErrorMessageExample() {
  const [value, setValue] = createSignal("Grapes");

  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<string[]>(ALL_STRING_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_STRING_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    // Remove selection when input is cleared.
    if (value === "") {
      setValue("");
    }

    setOptions(ALL_STRING_OPTIONS.filter(option => filter.contains(option, value)));
  };

  return (
    <Combobox.Root
      options={options()}
      value={value()}
      onChange={setValue}
      onInputChange={onInputChange}
      onOpenChange={onOpenChange}
      validationState={value() !== "Apple" ? "invalid" : "valid"}
      placeholder="Search a fruit…"
      itemComponent={props => (
        <Combobox.Item item={props.item} class={style["combobox__item"]}>
          <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
          <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
            <CheckIcon />
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
    >
      <Combobox.Control class={style["combobox__control"]} aria-label="Fruit">
        <Combobox.Input class={style["combobox__input"]} />
        <Combobox.Trigger class={style["combobox__trigger"]}>
          <Combobox.Icon class={style["combobox__icon"]}>
            <CaretSortIcon />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.ErrorMessage class={style["combobox__error-message"]}>
        Hmm, I prefer apples.
      </Combobox.ErrorMessage>
      <Combobox.Portal>
        <Combobox.Content class={style["combobox__content"]}>
          <Combobox.Listbox class={style["combobox__listbox"]} />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export function HTMLFormExample() {
  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<string[]>(ALL_STRING_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_STRING_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    setOptions(ALL_STRING_OPTIONS.filter(option => filter.contains(option, value)));
  };

  let formRef: HTMLFormElement | undefined;

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(formRef);

    alert(JSON.stringify(Object.fromEntries(formData), null, 2));
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} class="flex flex-col items-center space-y-6">
      <Combobox.Root
        name="fruit"
        options={options()}
        onInputChange={onInputChange}
        onOpenChange={onOpenChange}
        placeholder="Search a fruit…"
        itemComponent={props => (
          <Combobox.Item item={props.item} class={style["combobox__item"]}>
            <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
              <CheckIcon />
            </Combobox.ItemIndicator>
          </Combobox.Item>
        )}
      >
        <Combobox.HiddenSelect />
        <Combobox.Control class={style["combobox__control"]} aria-label="Fruit">
          <Combobox.Input class={style["combobox__input"]} />
          <Combobox.Trigger class={style["combobox__trigger"]}>
            <Combobox.Icon class={style["combobox__icon"]}>
              <CaretSortIcon />
            </Combobox.Icon>
          </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.ErrorMessage class={style["combobox__error-message"]}>
          Hmm, I prefer apples.
        </Combobox.ErrorMessage>
        <Combobox.Portal>
          <Combobox.Content class={style["combobox__content"]}>
            <Combobox.Listbox class={style["combobox__listbox"]} />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
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

const ALL_OBJECT_OPTIONS: Food[] = [
  { value: "apple", label: "Apple", disabled: false },
  { value: "banana", label: "Banana", disabled: false },
  { value: "blueberry", label: "Blueberry", disabled: false },
  { value: "grapes", label: "Grapes", disabled: true },
  { value: "pineapple", label: "Pineapple", disabled: false },
];

export function ObjectExample() {
  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<Food[]>(ALL_OBJECT_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_OBJECT_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    setOptions(ALL_OBJECT_OPTIONS.filter(option => filter.contains(option.label, value)));
  };

  return (
    <Combobox.Root
      options={options()}
      onInputChange={onInputChange}
      onOpenChange={onOpenChange}
      optionValue="value"
      optionTextValue="label"
      optionLabel="label"
      optionDisabled="disabled"
      placeholder="Search a fruit…"
      itemComponent={props => (
        <Combobox.Item item={props.item} class={style["combobox__item"]}>
          <Combobox.ItemLabel>{props.item.rawValue.label}</Combobox.ItemLabel>
          <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
            <CheckIcon />
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
    >
      <Combobox.Control class={style["combobox__control"]} aria-label="Fruit">
        <Combobox.Input class={style["combobox__input"]} />
        <Combobox.Trigger class={style["combobox__trigger"]}>
          <Combobox.Icon class={style["combobox__icon"]}>
            <CaretSortIcon />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Portal>
        <Combobox.Content class={style["combobox__content"]}>
          <Combobox.Listbox class={style["combobox__listbox"]} />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

interface Category {
  label: string;
  options: Food[];
}

const ALL_GROUP_OBJECT_OPTIONS: Category[] = [
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
  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<Array<Food | Category>>(ALL_GROUP_OBJECT_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_GROUP_OBJECT_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    setOptions(
      ALL_GROUP_OBJECT_OPTIONS.map(optionOrGroup => {
        // If it's a group, find matching options.
        const matchingOptions = optionOrGroup["options"]?.filter(option =>
          filter.contains(option.label, value)
        );

        // Return the group with only the matching options.
        if (matchingOptions && matchingOptions.length > 0) {
          return {
            ...optionOrGroup,
            options: [...matchingOptions],
          };
        }

        // It's not a group, return if it's a matching option.
        if (filter.contains(optionOrGroup.label, value)) {
          return optionOrGroup;
        }

        return null;
      }).filter(Boolean) as Array<Food | Category>
    );
  };

  return (
    <Combobox.Root<Food, Category>
      options={options()}
      onInputChange={onInputChange}
      onOpenChange={onOpenChange}
      optionValue="value"
      optionTextValue="label"
      optionLabel="label"
      optionDisabled="disabled"
      optionGroupChildren="options"
      placeholder="Search a food…"
      itemComponent={props => (
        <Combobox.Item item={props.item} class={style["combobox__item"]}>
          <Combobox.ItemLabel>{props.item.rawValue.label}</Combobox.ItemLabel>
          <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
            <CheckIcon />
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
      sectionComponent={props => (
        <Combobox.Section class={style["combobox__section"]}>
          {props.section.rawValue.label}
        </Combobox.Section>
      )}
    >
      <Combobox.Control class={style["combobox__control"]} aria-label="Food">
        <Combobox.Input class={style["combobox__input"]} />
        <Combobox.Trigger class={style["combobox__trigger"]}>
          <Combobox.Icon class={style["combobox__icon"]}>
            <CaretSortIcon />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Portal>
        <Combobox.Content class={style["combobox__content"]}>
          <Combobox.Listbox class={style["combobox__listbox"]} />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export function MultipleSelectionExample() {
  const [values, setValues] = createSignal(["Blueberry", "Grapes"]);

  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal<string[]>(ALL_STRING_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_STRING_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    setOptions(ALL_STRING_OPTIONS.filter(option => filter.contains(option, value)));
  };

  return (
    <>
      <Combobox.Root<string>
        multiple
        options={options()}
        value={values()}
        onChange={setValues}
        onInputChange={onInputChange}
        onOpenChange={onOpenChange}
        placeholder="Search some fruits…"
        itemComponent={props => (
          <Combobox.Item item={props.item} class={style["combobox__item"]}>
            <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class={style["combobox__item-indicator"]}>
              <CheckIcon />
            </Combobox.ItemIndicator>
          </Combobox.Item>
        )}
      >
        <Combobox.Control<string>
          class={`${style["combobox__control"]} ${style["combobox__control_multi"]}`}
          aria-label="Fruits"
        >
          {state => (
            <>
              <div
                class={`flex items-center gap-2 flex-wrap ${
                  state.selectedOptions().length > 0 && "p-2"
                }`}
              >
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
                <Combobox.Input
                  class={`${style["combobox__input"]} ${
                    state.selectedOptions().length > 0 && "!pl-0"
                  }`}
                />
              </div>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={state.clear}
                class="ml-auto self-center mr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-600 p-2"
              >
                <CrossIcon class="h-3.5 w-3.5" />
              </button>
              <Combobox.Trigger class={style["combobox__trigger"]}>
                <Combobox.Icon class={style["combobox__icon"]}>
                  <CaretSortIcon />
                </Combobox.Icon>
              </Combobox.Trigger>
            </>
          )}
        </Combobox.Control>
        <Combobox.Portal>
          <Combobox.Content class={style["combobox__content"]}>
            <Combobox.Listbox class={style["combobox__listbox"]} />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
      <p class="not-prose text-sm mt-4">Your favorite fruits are: {values().join(", ")}.</p>
    </>
  );
}
