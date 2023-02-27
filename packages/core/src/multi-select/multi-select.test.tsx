/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-spectrum/picker/test/Picker.test.js
 */

import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { Key } from "@kobalte/utils";
import { fireEvent, render, screen, within } from "solid-testing-library";

import * as MultiSelect from ".";

const DATA_SOURCE = [
  { key: "1", label: "One", textValue: "One", isDisabled: false },
  { key: "2", label: "Two", textValue: "Two", isDisabled: false },
  { key: "3", label: "Three", textValue: "Three", isDisabled: false },
];

describe("MultiSelect", () => {
  installPointerEvent();

  const onValueChange = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("supports selecting multiple options", async () => {
    render(() => (
      <MultiSelect.Root options={DATA_SOURCE} onValueChange={onValueChange}>
        <MultiSelect.Label>Label</MultiSelect.Label>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Placeholder">
            {({ selectedItems }) =>
              selectedItems()
                .map(item => item.rawValue.label)
                .join(", ")
            }
          </MultiSelect.Value>
        </MultiSelect.Trigger>
        <MultiSelect.Portal>
          <MultiSelect.Content>
            <MultiSelect.Listbox>
              {collection => (
                <Key each={[...collection()]} by="key">
                  {item => (
                    <MultiSelect.Item item={item()}>{item().rawValue.label}</MultiSelect.Item>
                  )}
                </Key>
              )}
            </MultiSelect.Listbox>
          </MultiSelect.Content>
        </MultiSelect.Portal>
      </MultiSelect.Root>
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

    fireEvent.click(items[0]);
    await Promise.resolve();

    fireEvent.click(items[2]);
    await Promise.resolve();

    expect(items[0]).toHaveAttribute("aria-selected", "true");
    expect(items[2]).toHaveAttribute("aria-selected", "true");

    expect(onValueChange).toBeCalledTimes(2);
    expect(onValueChange.mock.calls[0][0].has("1")).toBeTruthy();
    expect(onValueChange.mock.calls[1][0].has("3")).toBeTruthy();

    // Does not close on multi-select
    expect(listbox).toBeVisible();

    expect(trigger).toHaveTextContent("One, Three");
  });

  it("supports multiple defaultValue (uncontrolled)", async () => {
    const defaultValue = new Set(["1", "2"]);

    render(() => (
      <MultiSelect.Root
        options={DATA_SOURCE}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      >
        <MultiSelect.Label>Label</MultiSelect.Label>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Placeholder">
            {({ selectedItems }) =>
              selectedItems()
                .map(item => item.rawValue.label)
                .join(", ")
            }
          </MultiSelect.Value>
        </MultiSelect.Trigger>
        <MultiSelect.Portal>
          <MultiSelect.Content>
            <MultiSelect.Listbox>
              {collection => (
                <Key each={[...collection()]} by="key">
                  {item => (
                    <MultiSelect.Item item={item()}>{item().rawValue.label}</MultiSelect.Item>
                  )}
                </Key>
              )}
            </MultiSelect.Listbox>
          </MultiSelect.Content>
        </MultiSelect.Portal>
      </MultiSelect.Root>
    ));

    const trigger = screen.getByRole("button");

    fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
    await Promise.resolve();

    const listbox = screen.getByRole("listbox");
    const items = within(listbox).getAllByRole("option");

    expect(items[0]).toHaveAttribute("aria-selected", "true");
    expect(items[1]).toHaveAttribute("aria-selected", "true");

    // SelectBase a different option
    fireEvent.click(items[2]);
    await Promise.resolve();

    expect(items[2]).toHaveAttribute("aria-selected", "true");

    expect(onValueChange).toBeCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].has("1")).toBeTruthy();
    expect(onValueChange.mock.calls[0][0].has("2")).toBeTruthy();
    expect(onValueChange.mock.calls[0][0].has("3")).toBeTruthy();
  });

  it("supports multiple value (controlled)", async () => {
    const value = new Set(["1", "2"]);

    render(() => (
      <MultiSelect.Root options={DATA_SOURCE} value={value} onValueChange={onValueChange}>
        <MultiSelect.Label>Label</MultiSelect.Label>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Placeholder">
            {({ selectedItems }) =>
              selectedItems()
                .map(item => item.rawValue.label)
                .join(", ")
            }
          </MultiSelect.Value>
        </MultiSelect.Trigger>
        <MultiSelect.Portal>
          <MultiSelect.Content>
            <MultiSelect.Listbox>
              {collection => (
                <Key each={[...collection()]} by="key">
                  {item => (
                    <MultiSelect.Item item={item()}>{item().rawValue.label}</MultiSelect.Item>
                  )}
                </Key>
              )}
            </MultiSelect.Listbox>
          </MultiSelect.Content>
        </MultiSelect.Portal>
      </MultiSelect.Root>
    ));

    const trigger = screen.getByRole("button");

    fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
    await Promise.resolve();

    const listbox = screen.getByRole("listbox");
    const items = within(listbox).getAllByRole("option");

    expect(items[0]).toHaveAttribute("aria-selected", "true");
    expect(items[1]).toHaveAttribute("aria-selected", "true");

    // SelectBase a different option
    fireEvent.click(items[2]);
    await Promise.resolve();

    expect(items[2]).toHaveAttribute("aria-selected", "false");

    expect(onValueChange).toBeCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].has("3")).toBeTruthy();
  });

  it("supports deselection", async () => {
    const defaultValue = new Set(["1", "2"]);

    render(() => (
      <MultiSelect.Root
        options={DATA_SOURCE}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      >
        <MultiSelect.Label>Label</MultiSelect.Label>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Placeholder">
            {({ selectedItems }) =>
              selectedItems()
                .map(item => item.rawValue.label)
                .join(", ")
            }
          </MultiSelect.Value>
        </MultiSelect.Trigger>
        <MultiSelect.Portal>
          <MultiSelect.Content>
            <MultiSelect.Listbox>
              {collection => (
                <Key each={[...collection()]} by="key">
                  {item => (
                    <MultiSelect.Item item={item()}>{item().rawValue.label}</MultiSelect.Item>
                  )}
                </Key>
              )}
            </MultiSelect.Listbox>
          </MultiSelect.Content>
        </MultiSelect.Portal>
      </MultiSelect.Root>
    ));

    const trigger = screen.getByRole("button");

    fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
    await Promise.resolve();

    const listbox = screen.getByRole("listbox");
    const items = within(listbox).getAllByRole("option");

    expect(items[0]).toHaveAttribute("aria-selected", "true");
    expect(items[1]).toHaveAttribute("aria-selected", "true");

    // Deselect first option
    fireEvent.click(items[0]);
    await Promise.resolve();

    expect(items[0]).toHaveAttribute("aria-selected", "false");

    expect(onValueChange).toBeCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].has("1")).toBeFalsy();
    expect(onValueChange.mock.calls[0][0].has("2")).toBeTruthy();
  });
});
