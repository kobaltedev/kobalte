import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen } from "@solidjs/testing-library";

import * as ToggleButton from ".";

describe("ToggleButton", () => {
  installPointerEvent();

  it("can be default selected (uncontrolled)", () => {
    render(() => (
      <ToggleButton.Root data-testid="toggle" defaultPressed>
        Button
      </ToggleButton.Root>
    ));

    const toggle = screen.getByTestId("toggle");

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-pressed");
  });

  it("can be controlled", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <ToggleButton.Root data-testid="toggle" pressed onChange={onChangeSpy}>
        Button
      </ToggleButton.Root>
    ));

    const toggle = screen.getByTestId("toggle");

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-pressed");

    fireEvent.click(toggle);
    await Promise.resolve();

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-pressed");
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(false);
  });

  it("should have correct attributes when the toggle button is off (not selected)", () => {
    render(() => <ToggleButton.Root data-testid="toggle">Button</ToggleButton.Root>);

    const toggle = screen.getByTestId("toggle");

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).not.toHaveAttribute("data-pressed");
  });

  it("should have correct attributes when the toggle button is on (selected)", () => {
    render(() => (
      <ToggleButton.Root data-testid="toggle" pressed>
        Button
      </ToggleButton.Root>
    ));

    const toggle = screen.getByTestId("toggle");

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-pressed");
  });
});
