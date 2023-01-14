/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/703ab7b4559ecd4fc611e7f2c0e758867990fe01/packages/@react-spectrum/tabs/test/Tabs.test.js
 */

import { triggerPress } from "@kobalte/tests";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor, within } from "solid-testing-library";

import * as Tabs from ".";

describe("Tabs", function () {
  // Make userEvent work with jest fakeTimers
  // See https://github.com/testing-library/user-event/issues/833#issuecomment-1013797822
  const user = userEvent.setup({ delay: null });

  const onValueChangeSpy = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.runAllTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders properly", async () => {
    render(() => (
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeTruthy();
    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");

    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs.length).toBe(3);

    for (const tab of tabs) {
      expect(tab).toHaveAttribute("tabindex");
      expect(tab).toHaveAttribute("aria-selected");
      const isSelected = tab.getAttribute("aria-selected") === "true";

      if (isSelected) {
        expect(tab).toHaveAttribute("aria-controls");

        const tabpanel = document.getElementById(tab.getAttribute("aria-controls")!);
        expect(tabpanel).toBeTruthy();
        expect(tabpanel).toHaveAttribute("aria-labelledby", tab.id);
        expect(tabpanel).toHaveAttribute("role", "tabpanel");
        expect(tabpanel).toHaveTextContent("Body 1");
      }
    }
  });

  it("allows user to change tab item select via left/right arrow keys with horizontal tabs", async () => {
    render(() => (
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const selectedItem = tabs[0];

    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");

    expect(selectedItem).toHaveAttribute("aria-selected", "true");
    selectedItem.focus();

    fireEvent.keyDown(selectedItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    const nextSelectedItem = tabs[1];
    expect(nextSelectedItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(nextSelectedItem, { key: "ArrowLeft", code: 37, charCode: 37 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    /** Doesn't change selection because its horizontal tabs. */
    fireEvent.keyDown(selectedItem, { key: "ArrowUp", code: 38, charCode: 38 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(selectedItem, { key: "ArrowDown", code: 40, charCode: 40 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");
  });

  it("allows user to change tab item select via up/down arrow keys with vertical tabs", async () => {
    render(() => (
      <Tabs.Root orientation="vertical">
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const selectedItem = tabs[0];

    selectedItem.focus();

    expect(tablist).toHaveAttribute("aria-orientation", "vertical");

    /** Doesn't change selection because its vertical tabs. */
    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(selectedItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(selectedItem, { key: "ArrowLeft", code: 37, charCode: 37 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    const nextSelectedItem = tabs[1];

    fireEvent.keyDown(selectedItem, { key: "ArrowDown", code: 40, charCode: 40 });
    await Promise.resolve();

    expect(nextSelectedItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(nextSelectedItem, { key: "ArrowUp", code: 38, charCode: 38 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");
  });

  it("wraps focus from first to last/last to first item", async () => {
    render(() => (
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];

    firstItem.focus();

    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");

    expect(firstItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(firstItem, { key: "ArrowLeft", code: 37, charCode: 37 });
    await Promise.resolve();

    const lastItem = tabs[tabs.length - 1];

    expect(lastItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(lastItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    expect(firstItem).toHaveAttribute("aria-selected", "true");
  });

  it("select last item via end key / select first item via home key", async () => {
    render(() => (
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];

    firstItem.focus();

    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");

    expect(firstItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(firstItem, { key: "End", code: 35, charCode: 35 });
    await Promise.resolve();

    const lastItem = tabs[tabs.length - 1];

    expect(lastItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(lastItem, { key: "Home", code: 36, charCode: 36 });
    await Promise.resolve();

    expect(firstItem).toHaveAttribute("aria-selected", "true");
  });

  it("does not select via left / right keys if 'activationMode' is manual, select on enter / spacebar", async () => {
    render(() => (
      <Tabs.Root activationMode="manual" defaultValue="one" onValueChange={onValueChangeSpy}>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];
    const secondItem = tabs[1];
    const thirdItem = tabs[2];

    firstItem.focus();

    expect(firstItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(firstItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    expect(secondItem).toHaveAttribute("aria-selected", "false");
    expect(document.activeElement).toBe(secondItem);

    fireEvent.keyDown(secondItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    expect(thirdItem).toHaveAttribute("aria-selected", "false");
    expect(document.activeElement).toBe(thirdItem);

    fireEvent.keyDown(thirdItem, { key: "Enter", code: 13, charCode: 13 });
    await Promise.resolve();

    expect(firstItem).toHaveAttribute("aria-selected", "false");
    expect(secondItem).toHaveAttribute("aria-selected", "false");
    expect(thirdItem).toHaveAttribute("aria-selected", "true");
    expect(onValueChangeSpy).toBeCalledTimes(1);
  });

  it("supports using click to change tab", async () => {
    render(() => (
      <Tabs.Root activationMode="manual" defaultValue="one" onValueChange={onValueChangeSpy}>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];

    expect(firstItem).toHaveAttribute("aria-selected", "true");

    const secondItem = tabs[1];

    await triggerPress(secondItem);

    expect(secondItem).toHaveAttribute("aria-selected", "true");
    expect(secondItem).toHaveAttribute("aria-controls");

    const tabpanel = document.getElementById(secondItem.getAttribute("aria-controls")!);

    expect(tabpanel).toBeTruthy();
    expect(tabpanel).toHaveAttribute("aria-labelledby", secondItem.id);
    expect(tabpanel).toHaveAttribute("role", "tabpanel");
    expect(tabpanel).toHaveTextContent("Body 2");
    expect(onValueChangeSpy).toBeCalledTimes(1);
  });

  it("should focus the selected tab when tabbing in for the first time", async () => {
    render(() => (
      <Tabs.Root defaultValue="two">
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    await user.tab();

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");

    expect(document.activeElement).toBe(tabs[1]);
  });

  it("should not focus any tabs when isDisabled tabbing in for the first time", async () => {
    render(() => (
      <Tabs.Root defaultValue="two" isDisabled>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    await user.tab();

    const tabpanel = screen.getByRole("tabpanel");

    expect(document.activeElement).toBe(tabpanel);
  });

  it("disabled tabs cannot be keyboard navigated to", async () => {
    render(() => (
      <Tabs.Root defaultValue="one" onValueChange={onValueChangeSpy}>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two" isDisabled>
            Two
          </Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    await user.tab();

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");

    expect(document.activeElement).toBe(tabs[0]);

    fireEvent.keyDown(tabs[1], { key: "ArrowRight" });
    await Promise.resolve();

    fireEvent.keyUp(tabs[1], { key: "ArrowRight" });
    await Promise.resolve();

    expect(onValueChangeSpy).toBeCalledWith("three");
  });

  it("disabled tabs cannot be pressed", async () => {
    render(() => (
      <Tabs.Root defaultValue="one" onValueChange={onValueChangeSpy}>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two" isDisabled>
            Two
          </Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    await user.tab();

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");

    expect(document.activeElement).toBe(tabs[0]);

    await user.click(tabs[1]);

    expect(onValueChangeSpy).not.toBeCalled();
  });

  it("selects first tab if all tabs are disabled", async () => {
    render(() => (
      <Tabs.Root onValueChange={onValueChangeSpy}>
        <Tabs.List>
          <Tabs.Trigger value="one" isDisabled>
            One
          </Tabs.Trigger>
          <Tabs.Trigger value="two" isDisabled>
            Two
          </Tabs.Trigger>
          <Tabs.Trigger value="three" isDisabled>
            Three
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    await user.tab();

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const tabpanel = screen.getByRole("tabpanel");

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(onValueChangeSpy).toBeCalledWith("one");
    expect(document.activeElement).toBe(tabpanel);
  });

  it("tabpanel should have tabIndex=0 only when there are no focusable elements", async () => {
    render(() => (
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">
          <input />
        </Tabs.Content>
        <Tabs.Content value="two">
          <input disabled />
        </Tabs.Content>
      </Tabs.Root>
    ));

    let tabpanel = screen.getByRole("tabpanel");
    await waitFor(() => expect(tabpanel).not.toHaveAttribute("tabindex"));

    const tabs = screen.getAllByRole("tab");

    await triggerPress(tabs[1]);

    tabpanel = screen.getByRole("tabpanel");
    await waitFor(() => expect(tabpanel).toHaveAttribute("tabindex", "0"));

    await triggerPress(tabs[0]);

    tabpanel = screen.getByRole("tabpanel");
    await waitFor(() => expect(tabpanel).not.toHaveAttribute("tabindex"));
  });

  it("fires onValueChange when clicking on the current tab", async () => {
    render(() => (
      <Tabs.Root defaultValue="one" onValueChange={onValueChangeSpy}>
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Body 1</Tabs.Content>
        <Tabs.Content value="two">Body 2</Tabs.Content>
        <Tabs.Content value="three">Body 3</Tabs.Content>
      </Tabs.Root>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];

    expect(firstItem).toHaveAttribute("aria-selected", "true");

    await triggerPress(firstItem);

    expect(onValueChangeSpy).toBeCalledTimes(1);
    expect(onValueChangeSpy).toHaveBeenCalledWith("one");
  });
});
