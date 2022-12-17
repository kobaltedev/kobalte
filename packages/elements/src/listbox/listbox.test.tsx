/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-spectrum/listbox/test/Listbox.test.js
 */

import { fireEvent, render, screen } from "solid-testing-library";

import { Listbox } from "./listbox";

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
      <Listbox selectionMode="single">
        <Listbox.Option value="1">One</Listbox.Option>
        <Listbox.Option value="2">Two</Listbox.Option>
        <Listbox.Option value="3">Three</Listbox.Option>
      </Listbox>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    expect(listbox).toBeInTheDocument();

    expect(options.length).toBe(3);

    for (const option of options) {
      expect(option).toBeInTheDocument();
      expect(option).toHaveAttribute("tabindex");
      expect(option).toHaveAttribute("aria-selected", "false");
      expect(option).toHaveAttribute("aria-disabled", "false");
    }
  });

  it("allows user to change option focus via up/down arrow keys", async () => {
    render(() => (
      <Listbox>
        <Listbox.Option value="1">One</Listbox.Option>
        <Listbox.Option value="2">Two</Listbox.Option>
        <Listbox.Option value="3">Three</Listbox.Option>
      </Listbox>
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
      <Listbox shouldFocusWrap>
        <Listbox.Option value="1">One</Listbox.Option>
        <Listbox.Option value="2">Two</Listbox.Option>
        <Listbox.Option value="3">Three</Listbox.Option>
      </Listbox>
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
        <Listbox selectionMode="single" defaultValue={defaultValue}>
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2">Two</Listbox.Option>
          <Listbox.Option value="3">Three</Listbox.Option>
        </Listbox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");
      const selectedOption = options[1];

      fireEvent.focusIn(listbox);
      await Promise.resolve();

      expect(document.activeElement).toBe(selectedOption);
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
      expect(selectedOption).toHaveAttribute("tabindex", "0");
    });

    it("supports value (controlled)", async () => {
      const value = new Set(["2"]);
      const onValueChangeSpy = jest.fn();

      render(() => (
        <Listbox selectionMode="single" value={value} onValueChange={onValueChangeSpy}>
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2">Two</Listbox.Option>
          <Listbox.Option value="3">Three</Listbox.Option>
        </Listbox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");
      const selectedOption = options[1];

      fireEvent.focusIn(listbox);
      await Promise.resolve();

      expect(document.activeElement).toBe(selectedOption);
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
      expect(selectedOption).toHaveAttribute("tabindex", "0");

      const nextSelectedOption = options[2];

      // Try select a different option via enter
      fireEvent.keyDown(nextSelectedOption, { key: "Enter" });
      await Promise.resolve();

      // Since Listbox is controlled, selection doesn't change
      expect(nextSelectedOption).toHaveAttribute("aria-selected", "false");
      expect(selectedOption).toHaveAttribute("aria-selected", "true");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports using space key to change option selection", async () => {
      const onValueChangeSpy = jest.fn();

      render(() => (
        <Listbox selectionMode="single" onValueChange={onValueChangeSpy}>
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2">Two</Listbox.Option>
          <Listbox.Option value="3">Three</Listbox.Option>
        </Listbox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      fireEvent.focusIn(listbox);
      await Promise.resolve();

      const nextSelectedOption = options[2];

      // Select an option via space bar
      fireEvent.keyDown(nextSelectedOption, { key: " " });
      await Promise.resolve();

      expect(nextSelectedOption).toHaveAttribute("aria-selected", "true");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports using click to change option selection", async () => {
      const onValueChangeSpy = jest.fn();

      render(() => (
        <Listbox selectionMode="single" onValueChange={onValueChangeSpy}>
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2">Two</Listbox.Option>
          <Listbox.Option value="3">Three</Listbox.Option>
        </Listbox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      fireEvent.focusIn(listbox);
      await Promise.resolve();

      const nextSelectedOption = options[2];

      // Select an option via click
      fireEvent.click(nextSelectedOption);
      await Promise.resolve();

      expect(nextSelectedOption).toHaveAttribute("aria-selected", "true");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports disabled options", async () => {
      const onValueChangeSpy = jest.fn();

      render(() => (
        <Listbox selectionMode="single" onValueChange={onValueChangeSpy}>
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2" isDisabled>
            Two
          </Listbox.Option>
          <Listbox.Option value="3">Three</Listbox.Option>
        </Listbox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      const disabledOption = options[1];

      expect(disabledOption).toHaveAttribute("aria-disabled", "true");

      // Try select the disabled option
      fireEvent.click(disabledOption);
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
        <Listbox selectionMode="multiple" onValueChange={onValueChangeSpy}>
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2">Two</Listbox.Option>
          <Listbox.Option value="3">Three</Listbox.Option>
        </Listbox>
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
        <Listbox
          selectionMode="multiple"
          defaultValue={defaultValue}
          onValueChange={onValueChangeSpy}
        >
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2">Two</Listbox.Option>
          <Listbox.Option value="3">Three</Listbox.Option>
        </Listbox>
      ));

      const options = screen.getAllByRole("option");

      const firstOption = options[0];
      const secondOption = options[1];
      const thirdOption = options[2];

      expect(firstOption).toHaveAttribute("aria-selected", "true");
      expect(secondOption).toHaveAttribute("aria-selected", "true");

      // Select a different option
      fireEvent.click(thirdOption);
      await Promise.resolve();

      expect(thirdOption).toHaveAttribute("aria-selected", "true");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("1")).toBeTruthy();
      expect(onValueChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports multiple value (controlled)", async () => {
      const onValueChangeSpy = jest.fn();

      const value = new Set(["1", "2"]);

      render(() => (
        <Listbox selectionMode="multiple" value={value} onValueChange={onValueChangeSpy}>
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2">Two</Listbox.Option>
          <Listbox.Option value="3">Three</Listbox.Option>
        </Listbox>
      ));

      const options = screen.getAllByRole("option");

      const firstOption = options[0];
      const secondOption = options[1];
      const thirdOption = options[2];

      expect(firstOption).toHaveAttribute("aria-selected", "true");
      expect(secondOption).toHaveAttribute("aria-selected", "true");

      // Select a different option
      fireEvent.click(thirdOption);
      await Promise.resolve();

      expect(thirdOption).toHaveAttribute("aria-selected", "false");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports deselection", async () => {
      const onValueChangeSpy = jest.fn();

      const defaultValue = new Set(["1", "2"]);

      render(() => (
        <Listbox
          selectionMode="multiple"
          defaultValue={defaultValue}
          onValueChange={onValueChangeSpy}
        >
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2">Two</Listbox.Option>
          <Listbox.Option value="3">Three</Listbox.Option>
        </Listbox>
      ));

      const options = screen.getAllByRole("option");

      const firstOption = options[0];
      const secondOption = options[1];

      expect(firstOption).toHaveAttribute("aria-selected", "true");
      expect(secondOption).toHaveAttribute("aria-selected", "true");

      // Deselect first option
      fireEvent.click(firstOption);
      await Promise.resolve();

      expect(firstOption).toHaveAttribute("aria-selected", "false");

      expect(onValueChangeSpy).toBeCalledTimes(1);
      expect(onValueChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
    });

    it("supports disabled options", async () => {
      const onValueChangeSpy = jest.fn();

      const defaultValue = new Set(["1", "2"]);

      render(() => (
        <Listbox
          selectionMode="multiple"
          defaultValue={defaultValue}
          onValueChange={onValueChangeSpy}
        >
          <Listbox.Option value="1">One</Listbox.Option>
          <Listbox.Option value="2">Two</Listbox.Option>
          <Listbox.Option value="3" isDisabled>
            Three
          </Listbox.Option>
        </Listbox>
      ));

      const options = screen.getAllByRole("option");

      const firstOption = options[0];
      const secondOption = options[1];
      const disabledOption = options[2];

      expect(disabledOption).toHaveAttribute("aria-disabled", "true");

      fireEvent.click(disabledOption);
      await Promise.resolve();

      expect(onValueChangeSpy).not.toHaveBeenCalled();

      expect(firstOption).toHaveAttribute("aria-selected", "true");
      expect(secondOption).toHaveAttribute("aria-selected", "true");
    });
  });

  it("supports empty selection when disallowEmptySelection is false", async () => {
    const onValueChangeSpy = jest.fn();

    const defaultValue = new Set(["2"]);

    render(() => (
      <Listbox
        selectionMode="single"
        defaultValue={defaultValue}
        onValueChange={onValueChangeSpy}
        disallowEmptySelection={false}
      >
        <Listbox.Option value="1">One</Listbox.Option>
        <Listbox.Option value="2">Two</Listbox.Option>
        <Listbox.Option value="3">Three</Listbox.Option>
      </Listbox>
    ));

    const options = screen.getAllByRole("option");

    const secondOption = options[1];

    expect(secondOption).toHaveAttribute("aria-selected", "true");

    // Deselect second option
    fireEvent.click(secondOption);
    await Promise.resolve();

    expect(secondOption).toHaveAttribute("aria-selected", "false");

    expect(onValueChangeSpy).toBeCalledTimes(1);
    expect(onValueChangeSpy.mock.calls[0][0].size === 0).toBeTruthy();
  });

  it("supports type to select", async () => {
    render(() => (
      <Listbox>
        <Listbox.Option value="1">One</Listbox.Option>
        <Listbox.Option value="2">Two</Listbox.Option>
        <Listbox.Option value="3">Three</Listbox.Option>
      </Listbox>
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
      <Listbox>
        <Listbox.Option value="1">One</Listbox.Option>
        <Listbox.Option value="2">Two</Listbox.Option>
        <Listbox.Option value="3">Three</Listbox.Option>
      </Listbox>
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
      <Listbox>
        <Listbox.Option value="option" aria-label="Option">
          Item
        </Listbox.Option>
      </Listbox>
    ));

    jest.runAllTimers();

    const option = screen.getByRole("option");

    expect(option).toHaveAttribute("aria-label", "Option");
    expect(option).not.toHaveAttribute("aria-labelledby");
    expect(option).not.toHaveAttribute("aria-describedby");
  });

  it("supports complex options with aria-labelledby and aria-describedby", async () => {
    render(() => (
      <Listbox>
        <Listbox.Option value="option">
          <Listbox.OptionLabel>Label</Listbox.OptionLabel>
          <Listbox.OptionDescription>Description</Listbox.OptionDescription>
        </Listbox.Option>
      </Listbox>
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
      <Listbox aria-label="Test">
        <Listbox.Option value="1">One</Listbox.Option>
        <Listbox.Option value="2">Two</Listbox.Option>
        <Listbox.Option value="3">Three</Listbox.Option>
      </Listbox>
    ));

    const listbox = screen.getByRole("listbox");

    expect(listbox).toHaveAttribute("aria-label", "Test");
  });
});
