/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-spectrum/picker/test/Picker.test.js
 */

import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen, within } from "@solidjs/testing-library";

import * as Select from ".";

interface DataSourceItem {
  key: string;
  label: string;
  textValue: string;
  disabled: boolean;
}

const DATA_SOURCE: DataSourceItem[] = [
  { key: "1", label: "One", textValue: "One", disabled: false },
  { key: "2", label: "Two", textValue: "Two", disabled: false },
  { key: "3", label: "Three", textValue: "Three", disabled: false },
];

describe("Select", () => {
  installPointerEvent();

  const onValueChange = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("renders correctly", () => {
    render(() => (
      <Select.Root
        options={DATA_SOURCE}
        optionValue="key"
        optionTextValue="textValue"
        optionDisabled="disabled"
        placeholder="Placeholder"
        itemComponent={props => (
          <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
        )}
      >
        <Select.HiddenSelect />
        <Select.Label>Label</Select.Label>
        <Select.Trigger>
          <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Listbox />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    ));

    const root = screen.getByRole("group");

    expect(root).toBeInTheDocument();
    expect(root).toBeInstanceOf(HTMLDivElement);

    const select = screen.getByRole("textbox", { hidden: true });

    expect(select).not.toBeDisabled();

    const trigger = screen.getByRole("button");

    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

    const label = screen.getByText("Label");
    const value = screen.getByText("Placeholder");

    expect(label).toBeVisible();
    expect(value).toBeVisible();
  });

  describe("option mapping", () => {
    const CUSTOM_DATA_SOURCE_WITH_STRING_KEY = [
      {
        name: "Section 1",
        items: [
          { id: "1", name: "One", valueText: "One", disabled: false },
          { id: "2", name: "Two", valueText: "Two", disabled: true },
          { id: "3", name: "Three", valueText: "Three", disabled: false },
        ],
      },
    ];

    it("supports string based option mapping for object options with string keys", async () => {
      render(() => (
        <Select.Root<any, any>
          options={CUSTOM_DATA_SOURCE_WITH_STRING_KEY}
          optionValue="id"
          optionTextValue="valueText"
          optionDisabled="disabled"
          optionGroupChildren="items"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.name}</Select.Item>
          )}
          sectionComponent={props => <Select.Section>{props.section.rawValue.name}</Select.Section>}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<any>>{state => state.selectedOption().name}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);

      expect(items[0]).toHaveTextContent("One");
      expect(items[0]).toHaveAttribute("data-key", "1");
      expect(items[0]).not.toHaveAttribute("data-disabled");

      expect(items[1]).toHaveTextContent("Two");
      expect(items[1]).toHaveAttribute("data-key", "2");
      expect(items[1]).toHaveAttribute("data-disabled");

      expect(items[2]).toHaveTextContent("Three");
      expect(items[2]).toHaveAttribute("data-key", "3");
      expect(items[2]).not.toHaveAttribute("data-disabled");

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(CUSTOM_DATA_SOURCE_WITH_STRING_KEY[0].items[2]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports function based option mapping for object options with string keys", async () => {
      render(() => (
        <Select.Root<any, any>
          options={CUSTOM_DATA_SOURCE_WITH_STRING_KEY}
          optionValue={option => option.id}
          optionTextValue={option => option.valueText}
          optionDisabled={option => option.disabled}
          optionGroupChildren={optGroup => optGroup.items}
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.name}</Select.Item>
          )}
          sectionComponent={props => <Select.Section>{props.section.rawValue.name}</Select.Section>}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<any>>{state => state.selectedOption().name}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);

      expect(items[0]).toHaveTextContent("One");
      expect(items[0]).toHaveAttribute("data-key", "1");
      expect(items[0]).not.toHaveAttribute("data-disabled");

      expect(items[1]).toHaveTextContent("Two");
      expect(items[1]).toHaveAttribute("data-key", "2");
      expect(items[1]).toHaveAttribute("data-disabled");

      expect(items[2]).toHaveTextContent("Three");
      expect(items[2]).toHaveAttribute("data-key", "3");
      expect(items[2]).not.toHaveAttribute("data-disabled");

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(CUSTOM_DATA_SOURCE_WITH_STRING_KEY[0].items[2]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    const CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY = [
      {
        name: "Section 1",
        items: [
          { id: 1, name: "One", valueText: "One", disabled: false },
          { id: 2, name: "Two", valueText: "Two", disabled: true },
          { id: 3, name: "Three", valueText: "Three", disabled: false },
        ],
      },
    ];

    it("supports string based option mapping for object options with number keys", async () => {
      render(() => (
        <Select.Root<any, any>
          options={CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY}
          optionValue="id"
          optionTextValue="valueText"
          optionDisabled="disabled"
          optionGroupChildren="items"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.name}</Select.Item>
          )}
          sectionComponent={props => <Select.Section>{props.section.rawValue.name}</Select.Section>}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<any>>{state => state.selectedOption().name}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);

      expect(items[0]).toHaveTextContent("One");
      expect(items[0]).toHaveAttribute("data-key", "1");
      expect(items[0]).not.toHaveAttribute("data-disabled");

      expect(items[1]).toHaveTextContent("Two");
      expect(items[1]).toHaveAttribute("data-key", "2");
      expect(items[1]).toHaveAttribute("data-disabled");

      expect(items[2]).toHaveTextContent("Three");
      expect(items[2]).toHaveAttribute("data-key", "3");
      expect(items[2]).not.toHaveAttribute("data-disabled");

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY[0].items[2]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports function based option mapping for object options with number keys", async () => {
      render(() => (
        <Select.Root<any, any>
          options={CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY}
          optionValue={option => option.id}
          optionTextValue={option => option.valueText}
          optionDisabled={option => option.disabled}
          optionGroupChildren={optGroup => optGroup.items}
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.name}</Select.Item>
          )}
          sectionComponent={props => <Select.Section>{props.section.rawValue.name}</Select.Section>}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<any>>{state => state.selectedOption().name}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);

      expect(items[0]).toHaveTextContent("One");
      expect(items[0]).toHaveAttribute("data-key", "1");
      expect(items[0]).not.toHaveAttribute("data-disabled");

      expect(items[1]).toHaveTextContent("Two");
      expect(items[1]).toHaveAttribute("data-key", "2");
      expect(items[1]).toHaveAttribute("data-disabled");

      expect(items[2]).toHaveTextContent("Three");
      expect(items[2]).toHaveAttribute("data-key", "3");
      expect(items[2]).not.toHaveAttribute("data-disabled");

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY[0].items[2]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports string options without mapping", async () => {
      render(() => (
        <Select.Root
          options={["One", "Two", "Three"]}
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue}</Select.Item>
          )}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<string>>{state => state.selectedOption()}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);

      expect(items[0]).toHaveTextContent("One");
      expect(items[0]).toHaveAttribute("data-key", "One");
      expect(items[0]).not.toHaveAttribute("data-disabled");

      expect(items[1]).toHaveTextContent("Two");
      expect(items[1]).toHaveAttribute("data-key", "Two");
      expect(items[1]).not.toHaveAttribute("data-disabled");

      expect(items[2]).toHaveTextContent("Three");
      expect(items[2]).toHaveAttribute("data-key", "Three");
      expect(items[2]).not.toHaveAttribute("data-disabled");

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe("Three");

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports function based option mapping for string options", async () => {
      render(() => (
        <Select.Root
          options={["One", "Two", "Three"]}
          optionValue={option => option}
          optionTextValue={option => option}
          optionDisabled={option => option === "Two"}
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue}</Select.Item>
          )}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<string>>{state => state.selectedOption()}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);

      expect(items[0]).toHaveTextContent("One");
      expect(items[0]).toHaveAttribute("data-key", "One");
      expect(items[0]).not.toHaveAttribute("data-disabled");

      expect(items[1]).toHaveTextContent("Two");
      expect(items[1]).toHaveAttribute("data-key", "Two");
      expect(items[1]).toHaveAttribute("data-disabled");

      expect(items[2]).toHaveTextContent("Three");
      expect(items[2]).toHaveAttribute("data-key", "Three");
      expect(items[2]).not.toHaveAttribute("data-disabled");

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe("Three");

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports number options without mapping", async () => {
      render(() => (
        <Select.Root
          options={[1, 2, 3]}
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue}</Select.Item>
          )}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<number>>{state => state.selectedOption()}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);

      expect(items[0]).toHaveTextContent("1");
      expect(items[0]).toHaveAttribute("data-key", "1");
      expect(items[0]).not.toHaveAttribute("data-disabled");

      expect(items[1]).toHaveTextContent("2");
      expect(items[1]).toHaveAttribute("data-key", "2");
      expect(items[1]).not.toHaveAttribute("data-disabled");

      expect(items[2]).toHaveTextContent("3");
      expect(items[2]).toHaveAttribute("data-key", "3");
      expect(items[2]).not.toHaveAttribute("data-disabled");

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(3);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("3");
    });

    it("supports function based option mapping for number options", async () => {
      render(() => (
        <Select.Root
          options={[1, 2, 3]}
          optionValue={option => option}
          optionTextValue={option => option.toString()}
          optionDisabled={option => option === 2}
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue}</Select.Item>
          )}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<number>>{state => state.selectedOption()}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);

      expect(items[0]).toHaveTextContent("1");
      expect(items[0]).toHaveAttribute("data-key", "1");
      expect(items[0]).not.toHaveAttribute("data-disabled");

      expect(items[1]).toHaveTextContent("2");
      expect(items[1]).toHaveAttribute("data-key", "2");
      expect(items[1]).toHaveAttribute("data-disabled");

      expect(items[2]).toHaveTextContent("3");
      expect(items[2]).toHaveAttribute("data-key", "3");
      expect(items[2]).not.toHaveAttribute("data-disabled");

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(3);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("3");
    });
  });

  describe("opening", () => {
    it("can be opened on mouse down", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);
    });

    it("can be opened on touch up", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(screen.queryByRole("listbox")).toBeNull();

      fireEvent(
        trigger,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "touch",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      fireEvent.click(trigger);
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);
    });

    it("can be opened on Space key down", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: " " });
      fireEvent.keyUp(trigger, { key: " " });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on Enter key down", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "Enter" });
      fireEvent.keyUp(trigger, { key: "Enter" });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on ArrowDown key down and auto focuses the first item", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      fireEvent.keyUp(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on ArrowUp key down and auto focuses the last item", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "ArrowUp" });
      fireEvent.keyUp(trigger, { key: "ArrowUp" });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[2]);
    });

    it("can change item focus with arrow keys", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      fireEvent.keyUp(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      fireEvent.keyUp(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);
    });

    it("supports controlled open state", () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          open
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByRole("button", { hidden: true });

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);
    });

    it("supports default open state", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          defaultOpen
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByRole("button", { hidden: true });

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);
    });
  });

  describe("closing", () => {
    it("can be closed by clicking on the button", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      expect(listbox).not.toBeVisible();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(trigger);
    });

    it("can be closed by clicking outside", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent(
        document.body,
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(
        document.body,
        createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      jest.runAllTimers();

      expect(listbox).not.toBeVisible();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("can be closed by pressing the Escape key", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(listbox, { key: "Escape" });
      await Promise.resolve();

      expect(listbox).not.toBeVisible();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
    });

    it("does not close in controlled open state", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          open
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByLabelText("Placeholder");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(listbox, { key: "Escape" });
      fireEvent.keyUp(listbox, { key: "Escape" });
      await Promise.resolve();

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("closes in default open state", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          defaultOpen
          onOpenChange={onOpenChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByLabelText("Placeholder");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(listbox, { key: "Escape" });
      fireEvent.keyUp(listbox, { key: "Escape" });
      await Promise.resolve();

      expect(listbox).not.toBeVisible();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("labeling", () => {
    it("focuses on the trigger when you click the label", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const label = screen.getAllByText("Label")[0];

      fireEvent.click(label);
      await Promise.resolve();

      const trigger = screen.getByRole("button");

      expect(document.activeElement).toBe(trigger);
    });

    it("supports labeling with a visible label", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

      const label = screen.getAllByText("Label")[0];
      const value = screen.getByText("Placeholder");

      expect(label).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-labelledby", `${label.id} ${value.id}`);

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", label.id);
    });

    it("supports labeling via aria-label", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Trigger aria-label="foo">
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      const value = screen.getByText("Placeholder");

      expect(trigger).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-label", "foo");
      expect(trigger).toHaveAttribute("aria-labelledby", `${trigger.id} ${value.id}`);

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", trigger.id);
    });

    it("supports labeling via aria-labelledby", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Trigger aria-labelledby="foo">
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      const value = screen.getByText("Placeholder");

      expect(trigger).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-labelledby", `foo ${value.id}`);

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", "foo");
    });

    it("supports labeling via aria-label and aria-labelledby", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Trigger aria-label="bar" aria-labelledby="foo">
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      const value = screen.getByText("Placeholder");

      expect(trigger).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-label", "bar");
      expect(trigger).toHaveAttribute("aria-labelledby", `foo ${trigger.id} ${value.id}`);

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", `foo ${trigger.id}`);
    });
  });

  describe("help text", () => {
    it("supports description", () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Description>Description</Select.Description>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      const description = screen.getByText("Description");

      expect(description).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-describedby", description.id);
    });

    it("supports error message", () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          validationState="invalid"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.ErrorMessage>ErrorMessage</Select.ErrorMessage>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      const errorMessage = screen.getByText("ErrorMessage");

      expect(errorMessage).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-describedby", errorMessage.id);
    });
  });

  describe("selection", () => {
    it("can select items on press", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[2]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("can select items with the Space key", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(document.activeElement!, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: " " });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[0]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("One");
    });

    it("can select items with the Enter key", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent.focus(trigger);
      await Promise.resolve();

      fireEvent.keyDown(trigger, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "ArrowUp" });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);

      expect(listbox).not.toBeVisible();
      expect(trigger).toHaveTextContent("Two");
    });

    it("focuses items on hover", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);

      fireEvent(
        items[1],
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[2]);
      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("does not clear selection on escape closing the listbox", async () => {
      const onOpenChangeSpy = jest.fn();
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          onOpenChange={onOpenChangeSpy}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Placeholder");
      expect(onOpenChangeSpy).toHaveBeenCalledTimes(0);

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);

      let listbox = screen.getByRole("listbox");
      const label = screen.getAllByText("Label")[0];

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", label.id);

      let item1 = within(listbox).getByText("One");
      const item2 = within(listbox).getByText("Two");
      const item3 = within(listbox).getByText("Three");

      expect(item1).toBeTruthy();
      expect(item2).toBeTruthy();
      expect(item3).toBeTruthy();

      fireEvent(item3, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(item3, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole("listbox")).toBeNull();

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(3);

      listbox = screen.getByRole("listbox");
      item1 = within(listbox).getByText("One");

      fireEvent.keyDown(item1, { key: "Escape" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1); // still expecting it to have only been called once

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(4);
      expect(screen.queryByRole("listbox")).toBeNull();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports controlled selection", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          value={DATA_SOURCE[1]}
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Two");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[1]);

      expect(items[1]).toHaveAttribute("aria-selected", "true");

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[0]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Two");
    });

    it("supports default selection", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          defaultValue={DATA_SOURCE[1]}
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Two");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[1]);
      expect(items[1]).toHaveAttribute("aria-selected", "true");

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[0]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("One");
    });

    it("skips disabled items", async () => {
      const dataSource = [
        { key: "1", label: "One", textValue: "One", disabled: false },
        { key: "2", label: "Two", textValue: "Two", disabled: true },
        { key: "3", label: "Three", textValue: "Three", disabled: false },
      ];

      render(() => (
        <Select.Root
          options={dataSource}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);
      expect(items[1]).toHaveAttribute("aria-disabled", "true");

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(dataSource[2]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports type to select", async () => {
      const dataSource: DataSourceItem[] = [
        { key: "1", label: "One", textValue: "One", disabled: false },
        { key: "2", label: "Two", textValue: "Two", disabled: false },
        { key: "3", label: "Three", textValue: "Three", disabled: false },
        { key: "4", label: "Four", textValue: "Four", disabled: false },
      ];

      render(() => (
        <Select.Root
          options={dataSource}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      let listbox = screen.getByRole("listbox");
      let items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(listbox, { key: "t" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "t" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(listbox, { key: "h" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "h" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(dataSource[2]);

      expect(listbox).not.toBeVisible();
      expect(trigger).toHaveTextContent("Three");

      fireEvent.focus(trigger);
      await Promise.resolve();

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      listbox = screen.getByRole("listbox");
      items = within(listbox).getAllByRole("option");

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(listbox, { key: "f" });
      await Promise.resolve();

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(listbox).not.toBeVisible();
      expect(trigger).toHaveTextContent("Four");
      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange.mock.calls[1][0]).toBe(dataSource[3]);
    });

    it("does not deselect when pressing an already selected item", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          defaultValue={DATA_SOURCE[1]}
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Two");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(document.activeElement).toBe(items[1]);

      fireEvent(
        items[1],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[1], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);

      expect(listbox).not.toBeVisible();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Two");
    });

    it("move selection on Arrow-Left/Right", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveTextContent("One");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      expect(trigger).toHaveTextContent("One");

      fireEvent.keyDown(trigger, { key: "ArrowRight" });

      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(trigger).toHaveTextContent("Two");

      fireEvent.keyDown(trigger, { key: "ArrowRight" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(3);
      expect(trigger).toHaveTextContent("Three");

      fireEvent.keyDown(trigger, { key: "ArrowRight" });
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Three");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(4);
      expect(trigger).toHaveTextContent("Two");
    });
  });

  describe("multi-select", () => {
    it("supports selecting multiple options", async () => {
      render(() => (
        <Select.Root
          multiple
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>
              {({ selectedOptions }) =>
                selectedOptions()
                  .map(opt => opt.label)
                  .join(", ")
              }
            </Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(listbox).toHaveAttribute("aria-multiselectable", "true");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);

      fireEvent(
        items[0],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[0], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[2]).toHaveAttribute("aria-selected", "true");

      expect(onValueChange).toBeCalledTimes(2);
      expect(onValueChange.mock.calls[0][0].includes(DATA_SOURCE[0])).toBeTruthy();
      expect(onValueChange.mock.calls[1][0].includes(DATA_SOURCE[2])).toBeTruthy();

      // Does not close on multi-select
      expect(listbox).toBeVisible();

      expect(trigger).toHaveTextContent("One, Three");
    });

    it("supports multiple defaultValue (uncontrolled)", async () => {
      const defaultValue = [DATA_SOURCE[0], DATA_SOURCE[1]];

      render(() => (
        <Select.Root<DataSourceItem>
          multiple
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          defaultValue={defaultValue}
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>
              {({ selectedOptions }) =>
                selectedOptions()
                  .map(opt => opt.label)
                  .join(", ")
              }
            </Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[1]).toHaveAttribute("aria-selected", "true");

      // SelectBase a different option
      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(items[2]).toHaveAttribute("aria-selected", "true");

      expect(onValueChange).toBeCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].includes(DATA_SOURCE[0])).toBeTruthy();
      expect(onValueChange.mock.calls[0][0].includes(DATA_SOURCE[1])).toBeTruthy();
      expect(onValueChange.mock.calls[0][0].includes(DATA_SOURCE[2])).toBeTruthy();
    });

    it("supports multiple value (controlled)", async () => {
      const value = [DATA_SOURCE[0], DATA_SOURCE[1]];

      render(() => (
        <Select.Root<DataSourceItem>
          multiple
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          value={value}
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>
              {({ selectedOptions }) =>
                selectedOptions()
                  .map(opt => opt.label)
                  .join(", ")
              }
            </Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[1]).toHaveAttribute("aria-selected", "true");

      // SelectBase a different option
      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(items[2]).toHaveAttribute("aria-selected", "false");

      expect(onValueChange).toBeCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].includes(DATA_SOURCE[2])).toBeTruthy();
    });

    it("should keep the selection order", async () => {
      render(() => (
        <Select.Root
          multiple
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>
              {({ selectedOptions }) =>
                selectedOptions()
                  .map(opt => opt.label)
                  .join(", ")
              }
            </Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(trigger, createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(listbox).toHaveAttribute("aria-multiselectable", "true");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(listbox);

      fireEvent(
        items[2],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[2], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        items[0],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[0], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[2]).toHaveAttribute("aria-selected", "true");

      expect(onValueChange).toBeCalledTimes(2);
      expect(onValueChange.mock.calls[0][0].includes(DATA_SOURCE[2])).toBeTruthy();
      expect(onValueChange.mock.calls[1][0].includes(DATA_SOURCE[0])).toBeTruthy();

      // Does not close on multi-select
      expect(listbox).toBeVisible();

      expect(trigger).toHaveTextContent("Three, One");
    });

    it("supports deselection", async () => {
      const defaultValue = [DATA_SOURCE[0], DATA_SOURCE[1]];

      render(() => (
        <Select.Root<DataSourceItem>
          multiple
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          defaultValue={defaultValue}
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>
              {({ selectedOptions }) =>
                selectedOptions()
                  .map(opt => opt.label)
                  .join(", ")
              }
            </Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[1]).toHaveAttribute("aria-selected", "true");

      // Deselect first option
      fireEvent(
        items[0],
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      fireEvent(items[0], createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(items[0]).toHaveAttribute("aria-selected", "false");

      expect(onValueChange).toBeCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].includes(DATA_SOURCE[0])).toBeFalsy();
      expect(onValueChange.mock.calls[0][0].includes(DATA_SOURCE[1])).toBeTruthy();
    });
  });

  describe("type to select", () => {
    it("supports focusing items by typing letters in rapid succession without opening the menu", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent.keyDown(trigger, { key: "t" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "t" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);
      expect(trigger).toHaveTextContent("Two");

      fireEvent.keyDown(trigger, { key: "h" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "h" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange.mock.calls[1][0]).toBe(DATA_SOURCE[2]);
      expect(trigger).toHaveTextContent("Three");
    });

    it("resets the search text after a timeout", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent.keyDown(trigger, { key: "t" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "t" });
      await Promise.resolve();

      jest.runAllTimers();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);
      expect(trigger).toHaveTextContent("Two");

      fireEvent.keyDown(trigger, { key: "h" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "h" });
      await Promise.resolve();

      jest.runAllTimers();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveTextContent("Two");
    });

    it("wraps around when no items past the current one match", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");
      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent.keyDown(trigger, { key: "t" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "t" });
      await Promise.resolve();

      jest.runAllTimers();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);
      expect(trigger).toHaveTextContent("Two");

      fireEvent.keyDown(trigger, { key: "o" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "o" });
      await Promise.resolve();

      jest.runAllTimers();

      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(trigger).toHaveTextContent("One");
    });
  });

  describe("autofill", () => {
    it("should have a hidden select element for form autocomplete", async () => {
      const dataSource: DataSourceItem[] = [
        { key: "DE", label: "Germany", textValue: "Germany", disabled: false },
        { key: "FR", label: "France", textValue: "France", disabled: false },
        { key: "IT", label: "Italy", textValue: "Italy", disabled: false },
      ];

      render(() => (
        <Select.Root
          options={dataSource}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.HiddenSelect autocomplete="address-level1" />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Placeholder");

      const hiddenSelectBase = screen.getAllByRole("listbox", { hidden: true })[0];

      expect(hiddenSelectBase).toHaveAttribute("tabIndex", "-1");
      expect(hiddenSelectBase).toHaveAttribute("autocomplete", "address-level1");

      const options = within(hiddenSelectBase).getAllByRole("option", { hidden: true });

      expect(options.length).toBe(4);

      options.forEach(
        (option, index) =>
          index > 0 && expect(option).toHaveTextContent(dataSource[index - 1].label)
      );

      fireEvent.change(hiddenSelectBase, { target: { value: "FR" } });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toBe(dataSource[1]);
      expect(trigger).toHaveTextContent("France");
    });

    it("should have a hidden input to marshall focus to the button", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const hiddenInput = screen.getByRole("textbox", { hidden: true }); // get the hidden ones

      expect(hiddenInput).toHaveAttribute("tabIndex", "0");
      expect(hiddenInput).toHaveAttribute("style", "font-size: 16px;");
      expect(hiddenInput.parentElement).toHaveAttribute("aria-hidden", "true");

      hiddenInput.focus();
      await Promise.resolve();

      const button = screen.getByRole("button");

      expect(document.activeElement).toBe(button);
      expect(hiddenInput).toHaveAttribute("tabIndex", "-1");

      fireEvent.blur(button);
      await Promise.resolve();

      expect(hiddenInput).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("disabled", () => {
    it("disables the hidden select when disabled is true", async () => {
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          disabled
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.HiddenSelect />
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      const select = screen.getByRole("textbox", { hidden: true });

      expect(select).toBeDisabled();
    });

    it("does not open on mouse down when disabled is true", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          disabled
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(screen.queryByRole("listbox")).toBeNull();

      expect(onOpenChange).toBeCalledTimes(0);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("does not open on Space key press when disabled is true", async () => {
      const onOpenChange = jest.fn();
      render(() => (
        <Select.Root
          options={DATA_SOURCE}
          optionValue="key"
          optionTextValue="textValue"
          optionDisabled="disabled"
          placeholder="Placeholder"
          disabled
          onChange={onValueChange}
          itemComponent={props => (
            <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
          )}
        >
          <Select.Label>Label</Select.Label>
          <Select.Trigger>
            <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: " " });
      await Promise.resolve();

      expect(screen.queryByRole("listbox")).toBeNull();

      expect(onOpenChange).toBeCalledTimes(0);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(document.activeElement).not.toBe(trigger);
    });
  });

  describe("form", () => {
    it("Should submit empty option by default", async () => {
      let value;

      const onSubmit = jest.fn(e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        value = Object.fromEntries(formData).test; // same name as the select "name" prop
      });

      render(() => (
        <form data-testid="form" onSubmit={onSubmit}>
          <Select.Root
            options={DATA_SOURCE}
            optionValue="key"
            optionTextValue="textValue"
            optionDisabled="disabled"
            placeholder="Placeholder"
            name="test"
            itemComponent={props => (
              <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
            )}
          >
            <Select.HiddenSelect />
            <Select.Label>Label</Select.Label>
            <Select.Trigger autofocus>
              <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content>
                <Select.Listbox />
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <button type="submit" data-testid="submit">
            submit
          </button>
        </form>
      ));

      fireEvent.submit(screen.getByTestId("form"));
      await Promise.resolve();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(value).toBe("");
    });

    it("Should submit default option", async () => {
      let value;

      const onSubmit = jest.fn(e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        value = Object.fromEntries(formData).test; // same name as the select "name" prop
      });

      render(() => (
        <form data-testid="form" onSubmit={onSubmit}>
          <Select.Root
            options={DATA_SOURCE}
            optionValue="key"
            optionTextValue="textValue"
            optionDisabled="disabled"
            placeholder="Placeholder"
            name="test"
            defaultValue={DATA_SOURCE[0]}
            itemComponent={props => (
              <Select.Item item={props.item}>{props.item.rawValue.label}</Select.Item>
            )}
          >
            <Select.HiddenSelect />
            <Select.Label>Label</Select.Label>
            <Select.Trigger autofocus>
              <Select.Value<DataSourceItem>>{state => state.selectedOption().label}</Select.Value>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content>
                <Select.Listbox />
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </form>
      ));

      fireEvent.submit(screen.getByTestId("form"));
      await Promise.resolve();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(value).toEqual("1");
    });
  });
});
