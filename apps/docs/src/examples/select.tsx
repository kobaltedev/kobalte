import { Select } from "@kobalte/core";
import { ComponentProps, createSignal, For, splitProps } from "solid-js";

import { CaretSortIcon, CheckIcon } from "../components";
import style from "./select.module.css";

function SelectItem(props: ComponentProps<typeof Select.Item>) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <Select.Item class={style["select__item"]} {...others}>
      <Select.ItemLabel>{local.children}</Select.ItemLabel>
      <Select.ItemIndicator class={style["select__item-indicator"]}>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

export function BasicExample() {
  return (
    <Select>
      <Select.Trigger class={style["select__trigger"]} aria-label="Food">
        <Select.Value class={style["select__value"]} placeholder="Select a food…" />
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]}>
            <Select.Group>
              <Select.GroupLabel class={style["select__group-label"]}>Fruits</Select.GroupLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </Select.Group>

            <Select.Separator class={style["select__separator"]} />

            <Select.Group>
              <Select.GroupLabel class={style["select__group-label"]}>Vegetables</Select.GroupLabel>
              <SelectItem value="aubergine">Aubergine</SelectItem>
              <SelectItem value="broccoli">Broccoli</SelectItem>
              <SelectItem value="carrot" isDisabled>
                Carrot
              </SelectItem>
              <SelectItem value="courgette">Courgette</SelectItem>
              <SelectItem value="leek">Leek</SelectItem>
            </Select.Group>

            <Select.Separator class={style["select__separator"]} />

            <Select.Group>
              <Select.GroupLabel class={style["select__group-label"]}>Meat</Select.GroupLabel>
              <SelectItem value="beef">Beef</SelectItem>
              <SelectItem value="chicken">Chicken</SelectItem>
              <SelectItem value="lamb">Lamb</SelectItem>
              <SelectItem value="pork">Pork</SelectItem>
            </Select.Group>
          </Select.Listbox>
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

export function DefaultValueExample() {
  return (
    <Select defaultValue="Blueberry">
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value class={style["select__value"]} placeholder="Select a fruit…" />
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]}>
            <For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
              {fruit => (
                <Select.Item value={fruit} class={style["select__item"]}>
                  <Select.ItemLabel>{fruit}</Select.ItemLabel>
                  <Select.ItemIndicator class={style["select__item-indicator"]}>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              )}
            </For>
          </Select.Listbox>
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

export function ControlledExample() {
  const [value, setValue] = createSignal("Blueberry");

  return (
    <>
      <Select value={value()} onValueChange={setValue}>
        <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
          <Select.Value class={style["select__value"]} placeholder="Select a fruit…" />
          <Select.Icon class={style["select__icon"]}>
            <CaretSortIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class={style["select__content"]}>
            <Select.Listbox class={style["select__listbox"]}>
              <For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
                {fruit => (
                  <Select.Item value={fruit} class={style["select__item"]}>
                    <Select.ItemLabel>{fruit}</Select.ItemLabel>
                    <Select.ItemIndicator class={style["select__item-indicator"]}>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                )}
              </For>
            </Select.Listbox>
          </Select.Content>
        </Select.Portal>
      </Select>
      <p class="not-prose text-sm mt-4">Your favorite fruit is: {value()}.</p>
    </>
  );
}

export function MultiSelectExample() {
  const [values, setValues] = createSignal(new Set(["Blueberry", "Pineapple"]));

  return (
    <>
      <Select.Multi value={values()} onValueChange={setValues}>
        <Select.Trigger class={style["select__trigger"]} aria-label="Fruits">
          <Select.Value class={style["select__value"]} placeholder="Select some fruits…" />
          <Select.Icon class={style["select__icon"]}>
            <CaretSortIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class={style["select__content"]}>
            <Select.Listbox class={style["select__listbox"]}>
              <For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
                {fruit => (
                  <Select.Item value={fruit} class={style["select__item"]}>
                    <Select.ItemLabel>{fruit}</Select.ItemLabel>
                    <Select.ItemIndicator class={style["select__item-indicator"]}>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                )}
              </For>
            </Select.Listbox>
          </Select.Content>
        </Select.Portal>
      </Select.Multi>
      <p class="not-prose text-sm mt-4">Your favorite fruits are: {[...values()].join(", ")}.</p>
    </>
  );
}

export function DescriptionExample() {
  return (
    <Select>
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value class={style["select__value"]} placeholder="Select a fruit…" />
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Description class={style["select__description"]}>
        Choose the fruit you like the most.
      </Select.Description>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]}>
            <For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
              {fruit => (
                <Select.Item value={fruit} class={style["select__item"]}>
                  <Select.ItemLabel>{fruit}</Select.ItemLabel>
                  <Select.ItemIndicator class={style["select__item-indicator"]}>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              )}
            </For>
          </Select.Listbox>
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

export function ErrorMessageExample() {
  const [value, setValue] = createSignal("Grapes");

  return (
    <Select
      value={value()}
      onValueChange={setValue}
      validationState={value() !== "Apple" ? "invalid" : "valid"}
    >
      <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
        <Select.Value class={style["select__value"]} placeholder="Select a fruit…" />
        <Select.Icon class={style["select__icon"]}>
          <CaretSortIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.ErrorMessage class={style["select__error-message"]}>
        Hmm, I prefer apples.
      </Select.ErrorMessage>
      <Select.Portal>
        <Select.Content class={style["select__content"]}>
          <Select.Listbox class={style["select__listbox"]}>
            <For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
              {fruit => (
                <Select.Item value={fruit} class={style["select__item"]}>
                  <Select.ItemLabel>{fruit}</Select.ItemLabel>
                  <Select.ItemIndicator class={style["select__item-indicator"]}>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              )}
            </For>
          </Select.Listbox>
        </Select.Content>
      </Select.Portal>
    </Select>
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
      <Select name="fruit">
        <Select.Trigger class={style["select__trigger"]} aria-label="Fruit">
          <Select.Value class={style["select__value"]} placeholder="Select a fruit…" />
          <Select.Icon class={style["select__icon"]}>
            <CaretSortIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class={style["select__content"]}>
            <Select.Listbox class={style["select__listbox"]}>
              <For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
                {fruit => (
                  <Select.Item value={fruit} class={style["select__item"]}>
                    <Select.ItemLabel>{fruit}</Select.ItemLabel>
                    <Select.ItemIndicator class={style["select__item-indicator"]}>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                )}
              </For>
            </Select.Listbox>
          </Select.Content>
        </Select.Portal>
      </Select>
      <div class="flex space-x-2">
        <button type="reset" class="kb-button">
          Reset
        </button>
        <button class="kb-button-primary">Submit</button>
      </div>
    </form>
  );
}
