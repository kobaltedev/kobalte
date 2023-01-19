/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-spectrum/picker/test/Picker.test.js
 */

import { installPointerEvent, triggerPress } from "@kobalte/tests";
import { fireEvent, render, screen, within } from "solid-testing-library";

import * as MultiSelect from ".";

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
      <MultiSelect.Root onValueChange={onValueChange}>
        <MultiSelect.Label>Label</MultiSelect.Label>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Placeholder" />
        </MultiSelect.Trigger>
        <MultiSelect.Portal>
          <MultiSelect.Content>
            <MultiSelect.Listbox>
              <MultiSelect.Item value="1">One</MultiSelect.Item>
              <MultiSelect.Item value="2">Two</MultiSelect.Item>
              <MultiSelect.Item value="3">Three</MultiSelect.Item>
            </MultiSelect.Listbox>
          </MultiSelect.Content>
        </MultiSelect.Portal>
      </MultiSelect.Root>
    ));

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveTextContent("Placeholder");

    await triggerPress(trigger);

    const listbox = screen.getByRole("listbox");
    const items = within(listbox).getAllByRole("option");

    expect(listbox).toHaveAttribute("aria-multiselectable", "true");

    expect(items.length).toBe(3);
    expect(items[0]).toHaveTextContent("One");
    expect(items[1]).toHaveTextContent("Two");
    expect(items[2]).toHaveTextContent("Three");

    expect(document.activeElement).toBe(listbox);

    await triggerPress(items[0]);
    await triggerPress(items[2]);

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
      <MultiSelect.Root defaultValue={defaultValue} onValueChange={onValueChange}>
        <MultiSelect.Label>Label</MultiSelect.Label>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Placeholder" />
        </MultiSelect.Trigger>
        <MultiSelect.Portal>
          <MultiSelect.Content>
            <MultiSelect.Listbox>
              <MultiSelect.Item value="1">One</MultiSelect.Item>
              <MultiSelect.Item value="2">Two</MultiSelect.Item>
              <MultiSelect.Item value="3">Three</MultiSelect.Item>
            </MultiSelect.Listbox>
          </MultiSelect.Content>
        </MultiSelect.Portal>
      </MultiSelect.Root>
    ));

    const trigger = screen.getByRole("button");

    await triggerPress(trigger);

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
      <MultiSelect.Root value={value} onValueChange={onValueChange}>
        <MultiSelect.Label>Label</MultiSelect.Label>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Placeholder" />
        </MultiSelect.Trigger>
        <MultiSelect.Portal>
          <MultiSelect.Content>
            <MultiSelect.Listbox>
              <MultiSelect.Item value="1">One</MultiSelect.Item>
              <MultiSelect.Item value="2">Two</MultiSelect.Item>
              <MultiSelect.Item value="3">Three</MultiSelect.Item>
            </MultiSelect.Listbox>
          </MultiSelect.Content>
        </MultiSelect.Portal>
      </MultiSelect.Root>
    ));

    const trigger = screen.getByRole("button");

    await triggerPress(trigger);

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
      <MultiSelect.Root defaultValue={defaultValue} onValueChange={onValueChange}>
        <MultiSelect.Label>Label</MultiSelect.Label>
        <MultiSelect.Trigger>
          <MultiSelect.Value placeholder="Placeholder" />
        </MultiSelect.Trigger>
        <MultiSelect.Portal>
          <MultiSelect.Content>
            <MultiSelect.Listbox>
              <MultiSelect.Item value="1">One</MultiSelect.Item>
              <MultiSelect.Item value="2">Two</MultiSelect.Item>
              <MultiSelect.Item value="3">Three</MultiSelect.Item>
            </MultiSelect.Listbox>
          </MultiSelect.Content>
        </MultiSelect.Portal>
      </MultiSelect.Root>
    ));

    const trigger = screen.getByRole("button");

    await triggerPress(trigger);

    const listbox = screen.getByRole("listbox");
    const items = within(listbox).getAllByRole("option");

    expect(items[0]).toHaveAttribute("aria-selected", "true");
    expect(items[1]).toHaveAttribute("aria-selected", "true");

    // Deselect first option
    await triggerPress(items[0]);

    expect(items[0]).toHaveAttribute("aria-selected", "false");

    expect(onValueChange).toBeCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].has("1")).toBeFalsy();
    expect(onValueChange.mock.calls[0][0].has("2")).toBeTruthy();
  });
});
