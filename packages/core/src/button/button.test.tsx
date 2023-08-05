import { installPointerEvent } from "@kobalte/tests";
import { render, screen } from "@solidjs/testing-library";

import { As } from "../polymorphic";
import * as Button from ".";

describe("Button", () => {
  installPointerEvent();

  it("should have attribute 'type=button' by default", () => {
    render(() => <Button.Root data-testid="button">Button</Button.Root>);

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("type", "button");
  });

  it("should not have attribute 'type=button' by default when it's not a 'button' tag", () => {
    render(() => (
      <Button.Root data-testid="button" asChild>
        <As component="div">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("type", "button");
  });

  it("should keep attribute 'type' when provided and it's a native 'button' or 'input'", () => {
    render(() => (
      <Button.Root data-testid="button" asChild>
        <As component="input" type="submit">
          Button
        </As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("type", "submit");
  });

  it("should not have attribute 'role=button' when it's a native button", () => {
    render(() => <Button.Root data-testid="button">Button</Button.Root>);

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("role", "button");
  });

  it("should not have attribute 'role=button' when it's an 'a' tag with 'href'", () => {
    render(() => (
      <Button.Root data-testid="button" asChild>
        <As component="a" href="https://kobalte.dev">
          Button
        </As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("role", "button");
  });

  it("should have attribute 'role=button' when it's not a native button", () => {
    render(() => (
      <Button.Root data-testid="button" asChild>
        <As component="div">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("role", "button");
  });

  it("should have attribute 'role=button' when it's an 'a' tag without 'href'", () => {
    render(() => (
      <Button.Root data-testid="button" asChild>
        <As component="a">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("role", "button");
  });

  it("should have attribute 'tabindex=0' when it's not a native button", () => {
    render(() => (
      <Button.Root data-testid="button" asChild>
        <As component="div">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex=0' when it's an 'a' tag with 'href'", () => {
    render(() => (
      <Button.Root data-testid="button" asChild>
        <As component="a" href="https://kobalte.dev">
          Button
        </As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex=0' when it's disabled", () => {
    render(() => (
      <Button.Root data-testid="button" disabled asChild>
        <As component="div">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("tabindex", "0");
  });

  it("should have correct 'disabled' attribute when disabled and it's a native button", () => {
    render(() => (
      <Button.Root data-testid="button" disabled>
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("disabled");
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("should have correct 'disabled' attribute when disabled and it's an input", () => {
    render(() => (
      <Button.Root data-testid="button" disabled asChild>
        <As component="input">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("disabled");
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("should have correct 'disabled' attribute when disabled and it's not a native button nor input", () => {
    render(() => (
      <Button.Root data-testid="button" disabled asChild>
        <As component="div">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("disabled");
    expect(button).toHaveAttribute("aria-disabled");
  });

  it("should not have attribute 'data-disabled'  by default", async () => {
    render(() => <Button.Root data-testid="button">Button</Button.Root>);

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("data-disabled");
  });

  it("should have attribute 'data-disabled' when disabled", () => {
    render(() => (
      <Button.Root data-testid="button" disabled>
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("data-disabled");
  });
});
