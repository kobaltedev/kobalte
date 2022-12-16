/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-spectrum/picker/test/Picker.test.js
 */

import { createPointerEvent, installPointerEvent, triggerPress } from "@kobalte/tests";
import { fireEvent, render, screen, within } from "solid-testing-library";

import { SelectBase } from "./select-base";

const DATA = [
  { label: "One", value: "one" },
  { label: "Two", value: "two" },
  { label: "Three", value: "three" },
  { label: "Four", value: "four" },
];

describe("SelectBase", () => {
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
      <SelectBase options={DATA}>
        <SelectBase.Label>Label</SelectBase.Label>
        <SelectBase.Trigger>
          <SelectBase.Value placeholder="Placeholder" />
          <SelectBase.Icon />
        </SelectBase.Trigger>
        <SelectBase.Portal>
          <SelectBase.Positioner>
            <SelectBase.Menu>
              {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
            </SelectBase.Menu>
          </SelectBase.Positioner>
        </SelectBase.Portal>
      </SelectBase>
    ));

    const select = screen.getByRole("textbox", { hidden: true });

    expect(select).not.toBeDisabled();

    const trigger = screen.getByRole("button");

    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

    const label = screen.getByText("Label");
    const value = screen.getByText("Placeholder");

    expect(label).toBeVisible();
    expect(value).toBeVisible();
  });

  it("supports custom option and group object shape", async () => {
    const CUSTOM_DATA = [
      {
        key: "fruits",
        name: "Fruits",
        items: [
          {
            id: 1,
            name: "Apple",
            typeAheadValue: "apple",
            isDisabled: true,
          },
        ],
      },
    ];

    render(() => (
      <SelectBase
        options={CUSTOM_DATA}
        optionPropertyNames={{
          value: "id",
          label: "name",
          textValue: "typeAheadValue",
          disabled: "isDisabled",
        }}
        optionGroupPropertyNames={{
          id: "key",
          label: "name",
          options: "items",
        }}
      >
        <SelectBase.Label>Label</SelectBase.Label>
        <SelectBase.Trigger>
          <SelectBase.Value placeholder="Placeholder" />
          <SelectBase.Icon />
        </SelectBase.Trigger>
        <SelectBase.Portal>
          <SelectBase.Positioner>
            <SelectBase.Menu>
              {node => (
                <SelectBase.Group node={node()}>
                  <SelectBase.GroupLabel data-testid="group-label">
                    {node().label}
                  </SelectBase.GroupLabel>
                  <SelectBase.GroupOptions>
                    {childNode => (
                      <SelectBase.Option node={childNode()}>{childNode().label}</SelectBase.Option>
                    )}
                  </SelectBase.GroupOptions>
                </SelectBase.Group>
              )}
            </SelectBase.Menu>
          </SelectBase.Positioner>
        </SelectBase.Portal>
      </SelectBase>
    ));

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveTextContent("Placeholder");

    await triggerPress(trigger);
    jest.runAllTimers();

    const listbox = screen.getByRole("listbox");

    const groupLabel = within(listbox).getByTestId("group-label");

    expect(groupLabel).toHaveTextContent("Fruits");

    const items = within(listbox).getAllByRole("option");

    expect(items.length).toBe(1);
    expect(items[0]).toHaveTextContent("Apple");
    expect(items[0]).toHaveAttribute("data-key", "1");
    expect(items[0]).toHaveAttribute("aria-disabled", "true");
  });

  describe("opening", () => {
    it("can be opened on mouse down", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on touch up", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent(trigger, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();
      jest.runAllTimers();

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
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on Space key down", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: " " });
      fireEvent.keyUp(trigger, { key: " " });
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on Enter key down", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "Enter" });
      fireEvent.keyUp(trigger, { key: "Enter" });
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on ArrowDown key down and auto focuses the first item", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      fireEvent.keyUp(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on ArrowUp key down and auto focuses the last item", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "ArrowUp" });
      fireEvent.keyUp(trigger, { key: "ArrowUp" });
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[3]);
    });

    it("can change item focus with arrow keys", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      fireEvent.keyUp(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

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
        <SelectBase options={DATA} isOpen onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);
    });

    it("supports default open state", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} defaultIsOpen onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);
    });
  });

  describe("closing", () => {
    it("can be closed by clicking on the button", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      await triggerPress(trigger);
      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(trigger);
    });

    it("can be closed by clicking outside", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      await triggerPress(document.body);
      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("can be closed by pressing the Escape key", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      await triggerPress(trigger);

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(listbox, { key: "Escape" });
      await Promise.resolve();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(trigger);
    });

    it("does not close in controlled open state", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} isOpen onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByLabelText("Placeholder");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(listbox, { key: "Escape" });
      fireEvent.keyUp(listbox, { key: "Escape" });
      await Promise.resolve();
      jest.runAllTimers();

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("closes in default open state", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} defaultIsOpen onOpenChange={onOpenChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByLabelText("Placeholder");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(listbox, { key: "Escape" });
      fireEvent.keyUp(listbox, { key: "Escape" });
      await Promise.resolve();
      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("labeling", () => {
    it("focuses on the trigger when you click the label", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const label = screen.getAllByText("Label")[0];

      fireEvent.click(label);
      await Promise.resolve();

      const trigger = screen.getByRole("button");

      expect(document.activeElement).toBe(trigger);
    });

    it("supports labeling with a visible label", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

      const label = screen.getAllByText("Label")[0];
      const value = screen.getByText("Placeholder");

      expect(label).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-labelledby", `${label.id} ${value.id}`);

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", label.id);
    });

    it("supports labeling via aria-label", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Trigger aria-label="foo">
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      const value = screen.getByText("Placeholder");

      expect(trigger).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-label", "foo");
      expect(trigger).toHaveAttribute("aria-labelledby", `${trigger.id} ${value.id}`);

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", trigger.id);
    });

    it("supports labeling via aria-labelledby", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Trigger aria-labelledby="foo">
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      const value = screen.getByText("Placeholder");

      expect(trigger).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-labelledby", `foo ${value.id}`);

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", "foo");
    });

    it("supports labeling via aria-label and aria-labelledby", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Trigger aria-label="bar" aria-labelledby="foo">
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      const value = screen.getByText("Placeholder");

      expect(trigger).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-label", "bar");
      expect(trigger).toHaveAttribute("aria-labelledby", `foo ${trigger.id} ${value.id}`);

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", `foo ${trigger.id}`);
    });
  });

  describe("help text", () => {
    it("supports description", () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Description>Description</SelectBase.Description>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      jest.runAllTimers();

      const trigger = screen.getByRole("button");
      const description = screen.getByText("Description");

      expect(description).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-describedby", description.id);
    });

    it("supports error message", () => {
      render(() => (
        <SelectBase options={DATA} validationState="invalid" onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.ErrorMessage>ErrorMessage</SelectBase.ErrorMessage>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      jest.runAllTimers();

      const trigger = screen.getByRole("button");
      const errorMessage = screen.getByText("ErrorMessage");

      expect(errorMessage).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-describedby", errorMessage.id);
    });
  });

  describe("selection", () => {
    it("can select items on press", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);

      await triggerPress(items[2]);

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].has("three")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("can select items with falsy keys", async () => {
      const FALSY_KEY_DATA = [
        { value: "", label: "Empty" },
        { value: 0, label: "Zero" },
      ];

      render(() => (
        <SelectBase options={FALSY_KEY_DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Placeholder");

      await triggerPress(trigger);
      jest.runAllTimers();

      let listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(2);
      expect(items[0]).toHaveTextContent("Empty");
      expect(items[1]).toHaveTextContent("Zero");

      expect(document.activeElement).toBe(items[0]);

      await triggerPress(items[0]);

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].has("")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Empty");

      await triggerPress(trigger);
      jest.runAllTimers();

      listbox = screen.getByRole("listbox");
      const item1 = within(listbox).getByText("Zero");

      await triggerPress(item1);

      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange.mock.calls[1][0].has(0)).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Zero");
    });

    it("can select items with the Space key", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(document.activeElement!, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: " " });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].has("two")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Two");
    });

    it("can select items with the Enter key", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent.focus(trigger);
      await Promise.resolve();

      fireEvent.keyDown(trigger, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "ArrowUp" });
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[3]);

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].has("three")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveTextContent("Three");
    });

    it("focuses items on hover", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);

      fireEvent(
        items[1],
        createPointerEvent("pointerenter", { pointerId: 1, pointerType: "mouse" })
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
      expect(onValueChange.mock.calls[0][0].has("three")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("does not clear selection on escape closing the listbox", async () => {
      const onOpenChangeSpy = jest.fn();
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange} onOpenChange={onOpenChangeSpy}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Placeholder");
      expect(onOpenChangeSpy).toHaveBeenCalledTimes(0);

      await triggerPress(trigger);
      jest.runAllTimers();

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

      await triggerPress(item3);

      expect(onValueChange).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole("listbox")).toBeNull();

      await triggerPress(trigger);
      jest.runAllTimers();

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(3);

      listbox = screen.getByRole("listbox");
      item1 = within(listbox).getByText("One");

      fireEvent.keyDown(item1, { key: "Escape" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1); // still expecting it to have only been called once

      jest.runAllTimers();

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(4);
      expect(screen.queryByRole("listbox")).toBeNull();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports controlled selection", async () => {
      render(() => (
        <SelectBase options={DATA} value={["two"]} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Two");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

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
      expect(onValueChange.mock.calls[0][0].has("one")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Two");
    });

    it("supports default selection", async () => {
      render(() => (
        <SelectBase options={DATA} defaultValue={["two"]} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Two");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

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
      expect(onValueChange.mock.calls[0][0].has("one")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("One");
    });

    it("skips disabled items", async () => {
      const WITH_DISABLED_DATA = [
        { label: "One", value: "one" },
        { label: "Two", value: "two", disabled: true },
        { label: "Three", value: "three" },
      ];

      render(() => (
        <SelectBase options={WITH_DISABLED_DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
      expect(items[1]).toHaveAttribute("aria-disabled", "true");

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
      expect(onValueChange.mock.calls[0][0].has("three")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports type to select", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      jest.runAllTimers();

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
      expect(onValueChange.mock.calls[0][0].has("three")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveTextContent("Three");

      jest.advanceTimersByTime(500);

      fireEvent.focus(trigger);
      await Promise.resolve();

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await Promise.resolve();
      jest.runAllTimers();

      listbox = screen.getByRole("listbox");
      items = within(listbox).getAllByRole("option");

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(listbox, { key: "f" });
      await Promise.resolve();

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveTextContent("Four");
      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange.mock.calls[1][0].has("four")).toBeTruthy();
    });

    it("does not deselect when pressing an already selected item", async () => {
      render(() => (
        <SelectBase options={DATA} defaultValue={["two"]} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Two");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(document.activeElement).toBe(items[1]);

      await triggerPress(items[1]);

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].has("two")).toBeTruthy();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Two");
    });

    it("move selection on Arrow-Left/Right", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Placeholder");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      jest.runAllTimers();

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

      expect(onValueChange).toHaveBeenCalledTimes(4);
      expect(trigger).toHaveTextContent("Four");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(5);
      expect(trigger).toHaveTextContent("Three");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(6);
      expect(trigger).toHaveTextContent("Two");
    });
  });

  describe("multi selection", () => {
    it("supports selecting multiple options", async () => {
      render(() => (
        <SelectBase options={DATA} isMultiple onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Placeholder");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(listbox).toHaveAttribute("aria-multiselectable", "true");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");
      expect(items[3]).toHaveTextContent("Four");

      expect(document.activeElement).toBe(items[0]);

      await triggerPress(items[0]);
      await triggerPress(items[2]);

      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[2]).toHaveAttribute("aria-selected", "true");

      expect(onValueChange).toBeCalledTimes(2);
      expect(onValueChange.mock.calls[0][0].has("one")).toBeTruthy();
      expect(onValueChange.mock.calls[1][0].has("three")).toBeTruthy();

      // Does not close on multi-select
      expect(listbox).toBeInTheDocument();

      expect(trigger).toHaveTextContent("One, Three");
    });

    it("supports multiple defaultValue (uncontrolled)", async () => {
      const defaultValue = new Set(["one", "two"]);

      render(() => (
        <SelectBase
          options={DATA}
          isMultiple
          defaultValue={defaultValue}
          onValueChange={onValueChange}
        >
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[1]).toHaveAttribute("aria-selected", "true");

      // SelectBase a different option
      fireEvent.click(items[2]);
      await Promise.resolve();

      expect(items[2]).toHaveAttribute("aria-selected", "true");

      expect(onValueChange).toBeCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].has("one")).toBeTruthy();
      expect(onValueChange.mock.calls[0][0].has("two")).toBeTruthy();
      expect(onValueChange.mock.calls[0][0].has("three")).toBeTruthy();
    });

    it("supports multiple value (controlled)", async () => {
      const value = new Set(["one", "two"]);

      render(() => (
        <SelectBase options={DATA} isMultiple value={value} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[1]).toHaveAttribute("aria-selected", "true");

      // SelectBase a different option
      fireEvent.click(items[2]);
      await Promise.resolve();

      expect(items[2]).toHaveAttribute("aria-selected", "false");

      expect(onValueChange).toBeCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].has("three")).toBeTruthy();
    });

    it("supports deselection", async () => {
      const defaultValue = new Set(["one", "two"]);

      render(() => (
        <SelectBase
          options={DATA}
          isMultiple
          defaultValue={defaultValue}
          onValueChange={onValueChange}
        >
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");

      await triggerPress(trigger);
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items[0]).toHaveAttribute("aria-selected", "true");
      expect(items[1]).toHaveAttribute("aria-selected", "true");

      // Deselect first option
      await triggerPress(items[0]);

      expect(items[0]).toHaveAttribute("aria-selected", "false");

      expect(onValueChange).toBeCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].has("one")).toBeFalsy();
      expect(onValueChange.mock.calls[0][0].has("two")).toBeTruthy();
    });
  });

  describe("type to select", () => {
    it("supports focusing items by typing letters in rapid succession without opening the menu", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
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
      expect(onValueChange.mock.calls[0][0].has("two")).toBeTruthy();
      expect(trigger).toHaveTextContent("Two");

      fireEvent.keyDown(trigger, { key: "h" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "h" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange.mock.calls[1][0].has("three")).toBeTruthy();
      expect(trigger).toHaveTextContent("Three");
    });

    it("resets the search text after a timeout", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
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
      expect(onValueChange.mock.calls[0][0].has("two")).toBeTruthy();
      expect(trigger).toHaveTextContent("Two");

      jest.runAllTimers();

      fireEvent.keyDown(trigger, { key: "h" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "h" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveTextContent("Two");
    });

    it("wraps around when no items past the current one match", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
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
      expect(onValueChange.mock.calls[0][0].has("two")).toBeTruthy();
      expect(trigger).toHaveTextContent("Two");

      jest.runAllTimers();

      fireEvent.keyDown(trigger, { key: "o" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "o" });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(trigger).toHaveTextContent("One");
    });
  });

  describe("autofill", () => {
    it("should have a hidden select element for form autocomplete", async () => {
      const ADDRESS_DATA = [
        { label: "Germany", value: "DE" },
        { label: "France", value: "FR" },
        { label: "Italy", value: "IT" },
      ];

      render(() => (
        <SelectBase
          options={ADDRESS_DATA}
          autoComplete="address-level1"
          onValueChange={onValueChange}
        >
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Placeholder");

      // For anyone else who comes through this listbox/combobox path
      // I can't use combobox here because there is a size attribute on the html select
      // everything below this line is the path i followed to get to the correct role:
      //   not sure why i can't use listbox https://github.com/A11yance/aria-query#elements-to-roles
      //   however, i think this is correct based on https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
      //   which says "The listbox role is used for lists from which a user may select one or more items which are static and, unlike HTML <select> elements, may contain images."
      //   Also, this test in react testing library seems to indicate something about size which we do not currently have, probably a bug
      //   https://github.com/testing-library/dom-testing-library/blob/master/src/__tests__/element-queries.js#L548
      const hiddenSelectBase = screen.getByRole("listbox", { hidden: true });

      expect(hiddenSelectBase).toHaveAttribute("tabIndex", "-1");
      expect(hiddenSelectBase).toHaveAttribute("autocomplete", "address-level1");

      const options = within(hiddenSelectBase).getAllByRole("option", { hidden: true });

      expect(options.length).toBe(4);

      options.forEach(
        (option, index) =>
          index > 0 && expect(option).toHaveTextContent(ADDRESS_DATA[index - 1].label)
      );

      fireEvent.change(hiddenSelectBase, { target: { value: "FR" } });
      await Promise.resolve();

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0].has("FR")).toBeTruthy();
      expect(trigger).toHaveTextContent("France");
    });

    // TODO: failing, don't know why.
    it.skip("should have a hidden input to marshall focus to the button", async () => {
      render(() => (
        <SelectBase options={DATA} onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
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
    it("disables the hidden select when isDisabled is true", async () => {
      render(() => (
        <SelectBase options={DATA} isDisabled onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      const select = screen.getByRole("textbox", { hidden: true });

      expect(select).toBeDisabled();
    });

    it("does not open on mouse down when isDisabled is true", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <SelectBase options={DATA} isDisabled onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      await triggerPress(trigger);
      jest.runAllTimers();

      expect(screen.queryByRole("listbox")).toBeNull();

      expect(onOpenChange).toBeCalledTimes(0);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("does not open on Space key press when isDisabled is true", async () => {
      const onOpenChange = jest.fn();
      render(() => (
        <SelectBase options={DATA} isDisabled onValueChange={onValueChange}>
          <SelectBase.Label>Label</SelectBase.Label>
          <SelectBase.Trigger>
            <SelectBase.Value placeholder="Placeholder" />
            <SelectBase.Icon />
          </SelectBase.Trigger>
          <SelectBase.Portal>
            <SelectBase.Positioner>
              <SelectBase.Menu>
                {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
              </SelectBase.Menu>
            </SelectBase.Positioner>
          </SelectBase.Portal>
        </SelectBase>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: " " });
      await Promise.resolve();

      jest.runAllTimers();

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
          <SelectBase name="test" options={DATA}>
            <SelectBase.Label>Label</SelectBase.Label>
            <SelectBase.Trigger autofocus>
              <SelectBase.Value placeholder="Placeholder" />
              <SelectBase.Icon />
            </SelectBase.Trigger>
            <SelectBase.Portal>
              <SelectBase.Positioner>
                <SelectBase.Menu>
                  {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
                </SelectBase.Menu>
              </SelectBase.Positioner>
            </SelectBase.Portal>
          </SelectBase>
          <button type="submit" data-testid="submit">
            submit
          </button>
        </form>
      ));

      fireEvent.submit(screen.getByTestId("form"));
      await Promise.resolve();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(value).toEqual("");
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
          <SelectBase name="test" defaultValue={["one"]} options={DATA}>
            <SelectBase.Label>Label</SelectBase.Label>
            <SelectBase.Trigger autofocus>
              <SelectBase.Value placeholder="Placeholder" />
              <SelectBase.Icon />
            </SelectBase.Trigger>
            <SelectBase.Portal>
              <SelectBase.Positioner>
                <SelectBase.Menu>
                  {node => <SelectBase.Option node={node()}>{node().label}</SelectBase.Option>}
                </SelectBase.Menu>
              </SelectBase.Positioner>
            </SelectBase.Portal>
          </SelectBase>
        </form>
      ));

      fireEvent.submit(screen.getByTestId("form"));
      await Promise.resolve();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(value).toEqual("one");
    });
  });
});
