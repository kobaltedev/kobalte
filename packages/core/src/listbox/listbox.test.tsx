/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-spectrum/listbox/test/Listbox.test.js
 */

import { fireEvent, render, screen } from "solid-testing-library";

import * as Listbox from ".";

describe("Listbox", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.requestAnimationFrame.mockRestore();
    jest.clearAllTimers();
  });

  it("renders properly", () => {
    render(() => (
      <Listbox.Root selectionMode="single">
        <Listbox.Item value="1">One</Listbox.Item>
        <Listbox.Item value="2">Two</Listbox.Item>
        <Listbox.Item value="3">Three</Listbox.Item>
      </Listbox.Root>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    expect(listbox).toBeInTheDocument();

    expect(options.length).toBe(3);

    for (const option of options) {
      expect(option).toBeInTheDocument();
      expect(option).toHaveAttribute("tabindex");
      expect(option).toHaveAttribute("aria-selected", "false");
      expect(option).not.toHaveAttribute("aria-disabled");
    }
  });

  it("allows user to change option focus via up/down arrow keys", async () => {
    render(() => (
      <Listbox.Root>
        <Listbox.Item value="1">One</Listbox.Item>
        <Listbox.Item value="2">Two</Listbox.Item>
        <Listbox.Item value="3">Three</Listbox.Item>
      </Listbox.Root>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    fireEvent.focusIn(listbox);
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);

    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    await Promise.resolve();

    expect(document.activeElement).toBe(options[1]);

    fireEvent.keyDown(listbox, { key: "ArrowUp" });
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);
  });

  it("wraps focus from first to last/last to first option if up/down arrow is pressed if shouldFocusWrap is true", async () => {
    render(() => (
      <Listbox.Root shouldFocusWrap>
        <Listbox.Item value="1">One</Listbox.Item>
        <Listbox.Item value="2">Two</Listbox.Item>
        <Listbox.Item value="3">Three</Listbox.Item>
      </Listbox.Root>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    fireEvent.focusIn(listbox);
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);

    fireEvent.keyDown(listbox, { key: "ArrowUp" });
    await Promise.resolve();

    expect(document.activeElement).toBe(options[2]);

    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);
  });

  describe("supports single selection", () => {
    it("supports defaultValue (uncontrolled)", async () => {
      const defaultValue = new Set(["2"]);

      render(() => (
        <Listbox.Root selectionMode="single" defaultValue={defaultValue}>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">Two</Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");
      const selectedItem = options[1];

      fireEvent.focusIn(listbox);
      await Promise.resolve();

      expect(document.activeElement).toBe(selectedItem);
      expect(selectedItem).toHaveAttribute("aria-selected", "true");
      expect(selectedItem).toHaveAttribute("tabindex", "0");
    });

    it("supports value (controlled)", async () => {
      const value = new Set(["2"]);
      const onValueChangeSpy = jest.fn();

      render(() => (
        <Listbox.Root selectionMode="single" value={value} onValueChange={onValueChangeSpy}>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">Two</Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");
      const selectedItem = options[1];

      fireEvent.focusIn(listbox);
      await Promise.resolve();

      expect(document.activeElement).toBe(selectedItem);
      expect(selectedItem).toHaveAttribute("aria-selected", "true");
      expect(selectedItem).toHaveAttribute("tabindex", "0");

      const nextSelectedItem = options[2];

      // Try select a different option via enter
      fireEvent.keyDown(nextSelectedItem, { key: "Enter" });
      await Promise.resolve();

      // Since Listbox is controlled, selection doesn't change
      expect(nextSelectedItem).toHaveAttribute("aria-selected", "false");
      expect(selectedItem).toHaveAttribute("aria-selected", "true");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports using space key to change option selection", async () => {
      const onValueChangeSpy = jest.fn();

      render(() => (
        <Listbox.Root selectionMode="single" onValueChange={onValueChangeSpy}>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">Two</Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      fireEvent.focusIn(listbox);
      await Promise.resolve();

      const nextSelectedItem = options[2];

      // Select an option via space bar
      fireEvent.keyDown(nextSelectedItem, { key: " " });
      await Promise.resolve();

      expect(nextSelectedItem).toHaveAttribute("aria-selected", "true");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports using click to change option selection", async () => {
      const onValueChangeSpy = jest.fn();

      render(() => (
        <Listbox.Root selectionMode="single" onValueChange={onValueChangeSpy}>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">Two</Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      fireEvent.focusIn(listbox);
      await Promise.resolve();

      const nextSelectedItem = options[2];

      // Select an option via click
      fireEvent.click(nextSelectedItem);
      await Promise.resolve();

      expect(nextSelectedItem).toHaveAttribute("aria-selected", "true");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports disabled options", async () => {
      const onValueChangeSpy = jest.fn();

      render(() => (
        <Listbox.Root selectionMode="single" onValueChange={onValueChangeSpy}>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2" isDisabled>
            Two
          </Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      const disabledItem = options[1];

      expect(disabledItem).toHaveAttribute("aria-disabled", "true");

      // Try select the disabled option
      fireEvent.click(disabledItem);
      await Promise.resolve();

      // Verify onValueChange is not called
      expect(onValueChangeSpy).not.toHaveBeenCalled();

      fireEvent.focusIn(listbox);
      await Promise.resolve();

      expect(document.activeElement).toBe(options[0]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      // Verify that keyboard navigation skips the disabled option
      expect(document.activeElement).toBe(options[2]);
    });
  });

  describe("supports multi selection", () => {
    it("supports selecting multiple options", async () => {
      const onValueChangeSpy = jest.fn();

      render(() => (
        <Listbox.Root selectionMode="multiple" onValueChange={onValueChangeSpy}>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">Two</Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      expect(listbox).toHaveAttribute("aria-multiselectable", "true");

      fireEvent.click(options[0]);
      await Promise.resolve();

      fireEvent.click(options[2]);
      await Promise.resolve();

      expect(options[0]).toHaveAttribute("aria-selected", "true");
      expect(options[2]).toHaveAttribute("aria-selected", "true");

      expect(onValueChangeSpy).toBeCalledTimes(2);
      expect(onValueChangeSpy.mock.calls[0][0].has("1")).toBeTruthy();
      expect(onValueChangeSpy.mock.calls[1][0].has("3")).toBeTruthy();
    });

    it("supports multiple defaultValue (uncontrolled)", async () => {
      const onValueChangeSpy = jest.fn();

      const defaultValue = new Set(["1", "2"]);

      render(() => (
        <Listbox.Root
          selectionMode="multiple"
          defaultValue={defaultValue}
          onValueChange={onValueChangeSpy}
        >
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">Two</Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      const options = screen.getAllByRole("option");

      const firstItem = options[0];
      const secondItem = options[1];
      const thirdItem = options[2];

      expect(firstItem).toHaveAttribute("aria-selected", "true");
      expect(secondItem).toHaveAttribute("aria-selected", "true");

      // Select a different option
      fireEvent.click(thirdItem);
      await Promise.resolve();

      expect(thirdItem).toHaveAttribute("aria-selected", "true");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("1")).toBeTruthy();
      expect(onValueChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports multiple value (controlled)", async () => {
      const onValueChangeSpy = jest.fn();

      const value = new Set(["1", "2"]);

      render(() => (
        <Listbox.Root selectionMode="multiple" value={value} onValueChange={onValueChangeSpy}>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">Two</Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      const options = screen.getAllByRole("option");

      const firstItem = options[0];
      const secondItem = options[1];
      const thirdItem = options[2];

      expect(firstItem).toHaveAttribute("aria-selected", "true");
      expect(secondItem).toHaveAttribute("aria-selected", "true");

      // Select a different option
      fireEvent.click(thirdItem);
      await Promise.resolve();

      expect(thirdItem).toHaveAttribute("aria-selected", "false");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports deselection", async () => {
      const onValueChangeSpy = jest.fn();

      const defaultValue = new Set(["1", "2"]);

      render(() => (
        <Listbox.Root
          selectionMode="multiple"
          defaultValue={defaultValue}
          onValueChange={onValueChangeSpy}
        >
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">Two</Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      const options = screen.getAllByRole("option");

      const firstItem = options[0];
      const secondItem = options[1];

      expect(firstItem).toHaveAttribute("aria-selected", "true");
      expect(secondItem).toHaveAttribute("aria-selected", "true");

      // Deselect first option
      fireEvent.click(firstItem);
      await Promise.resolve();

      expect(firstItem).toHaveAttribute("aria-selected", "false");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
    });

    it("supports disabled options", async () => {
      const onValueChangeSpy = jest.fn();

      const defaultValue = new Set(["1", "2"]);

      render(() => (
        <Listbox.Root
          selectionMode="multiple"
          defaultValue={defaultValue}
          onValueChange={onValueChangeSpy}
        >
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">Two</Listbox.Item>
          <Listbox.Item value="3" isDisabled>
            Three
          </Listbox.Item>
        </Listbox.Root>
      ));

      const options = screen.getAllByRole("option");

      const firstItem = options[0];
      const secondItem = options[1];
      const disabledItem = options[2];

      expect(disabledItem).toHaveAttribute("aria-disabled", "true");

      fireEvent.click(disabledItem);
      await Promise.resolve();

      expect(onValueChangeSpy).not.toHaveBeenCalled();

      expect(firstItem).toHaveAttribute("aria-selected", "true");
      expect(secondItem).toHaveAttribute("aria-selected", "true");
    });
  });

  it("supports empty selection when disallowEmptySelection is false", async () => {
    const onValueChangeSpy = jest.fn();

    const defaultValue = new Set(["2"]);

    render(() => (
      <Listbox.Root
        selectionMode="single"
        defaultValue={defaultValue}
        onValueChange={onValueChangeSpy}
        disallowEmptySelection={false}
      >
        <Listbox.Item value="1">One</Listbox.Item>
        <Listbox.Item value="2">Two</Listbox.Item>
        <Listbox.Item value="3">Three</Listbox.Item>
      </Listbox.Root>
    ));

    const options = screen.getAllByRole("option");

    const secondItem = options[1];

    expect(secondItem).toHaveAttribute("aria-selected", "true");

    // Deselect second option
    fireEvent.click(secondItem);
    await Promise.resolve();

    expect(secondItem).toHaveAttribute("aria-selected", "false");

    expect(onValueChangeSpy).toBeCalledTimes(1);
    expect(onValueChangeSpy.mock.calls[0][0].size === 0).toBeTruthy();
  });

  it("supports type to select", async () => {
    render(() => (
      <Listbox.Root>
        <Listbox.Item value="1">One</Listbox.Item>
        <Listbox.Item value="2">Two</Listbox.Item>
        <Listbox.Item value="3">Three</Listbox.Item>
      </Listbox.Root>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    fireEvent.focusIn(listbox);
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);

    fireEvent.keyDown(listbox, { key: "T" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(options[1]);

    fireEvent.keyDown(listbox, { key: "O" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);
  });

  it("resets the search text after a timeout", async () => {
    render(() => (
      <Listbox.Root>
        <Listbox.Item value="1">One</Listbox.Item>
        <Listbox.Item value="2">Two</Listbox.Item>
        <Listbox.Item value="3">Three</Listbox.Item>
      </Listbox.Root>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    fireEvent.focusIn(listbox);
    await Promise.resolve();

    fireEvent.keyDown(listbox, { key: "O" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);

    fireEvent.keyDown(listbox, { key: "O" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);
  });

  it("supports aria-label on options", () => {
    render(() => (
      <Listbox.Root>
        <Listbox.Item value="option" aria-label="Item">
          Item
        </Listbox.Item>
      </Listbox.Root>
    ));

    jest.runAllTimers();

    const option = screen.getByRole("option");

    expect(option).toHaveAttribute("aria-label", "Item");
    expect(option).not.toHaveAttribute("aria-labelledby");
    expect(option).not.toHaveAttribute("aria-describedby");
  });

  it("supports complex options with aria-labelledby and aria-describedby", async () => {
    render(() => (
      <Listbox.Root>
        <Listbox.Item value="option">
          <Listbox.ItemLabel>Label</Listbox.ItemLabel>
          <Listbox.ItemDescription>Description</Listbox.ItemDescription>
        </Listbox.Item>
      </Listbox.Root>
    ));

    jest.runAllTimers();

    const option = screen.getByRole("option");
    const label = screen.getByText("Label");
    const description = screen.getByText("Description");

    expect(option).toHaveAttribute("aria-labelledby", label.id);
    expect(option).toHaveAttribute("aria-describedby", description.id);
  });

  it("supports aria-label", () => {
    render(() => (
      <Listbox.Root aria-label="Test">
        <Listbox.Item value="1">One</Listbox.Item>
        <Listbox.Item value="2">Two</Listbox.Item>
        <Listbox.Item value="3">Three</Listbox.Item>
      </Listbox.Root>
    ));

    const listbox = screen.getByRole("listbox");

    expect(listbox).toHaveAttribute("aria-label", "Test");
  });

  describe("item indicator", () => {
    it("should not display item indicator by default", async () => {
      render(() => (
        <Listbox.Root>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">
            <Listbox.ItemLabel>Two</Listbox.ItemLabel>
            <Listbox.ItemIndicator data-testid="indicator" />
          </Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      expect(screen.queryByTestId("indicator")).toBeNull();
    });

    it("should display item indicator when 'selected'", async () => {
      render(() => (
        <Listbox.Root value={["2"]}>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">
            <Listbox.ItemLabel>Two</Listbox.ItemLabel>
            <Listbox.ItemIndicator data-testid="indicator" />
          </Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      expect(screen.getByTestId("indicator")).toBeInTheDocument();
    });

    it("should display item indicator when 'forceMount'", async () => {
      render(() => (
        <Listbox.Root>
          <Listbox.Item value="1">One</Listbox.Item>
          <Listbox.Item value="2">
            <Listbox.ItemLabel>Two</Listbox.ItemLabel>
            <Listbox.ItemIndicator data-testid="indicator" forceMount />
          </Listbox.Item>
          <Listbox.Item value="3">Three</Listbox.Item>
        </Listbox.Root>
      ));

      expect(screen.getByTestId("indicator")).toBeInTheDocument();
    });
  });
});
