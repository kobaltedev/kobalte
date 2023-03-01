import {
  checkAccessibility,
  installPointerEvent,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { render, screen } from "solid-testing-library";

import { As } from "../polymorphic";
import * as Button from ".";

const defaultProps: Button.ButtonRootOptions = {};

describe("Button", () => {
  installPointerEvent();

  checkAccessibility([<Button.Root>Button</Button.Root>]);
  itRendersChildren(Button.Root as any, defaultProps);
  itSupportsClass(Button.Root as any, defaultProps);
  itSupportsRef(Button.Root as any, defaultProps, HTMLButtonElement);
  itSupportsStyle(Button.Root as any, defaultProps);

  it("should have attribute 'type=button' by default", () => {
    render(() => <Button.Root data-testid="button">Button</Button.Root>);

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("type", "button");
  });

  it("should not have attribute 'type=button' by default when it's not a 'button' tag", () => {
    render(() => (
      <Button.Root data-testid="button">
        <As component="div">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("type", "button");
  });

  it("should keep attribute 'type' when provided and it's a native 'button' or 'input'", () => {
    render(() => (
      <Button.Root data-testid="button">
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
      <Button.Root data-testid="button">
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
      <Button.Root data-testid="button">
        <As component="div">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("role", "button");
  });

  it("should have attribute 'role=button' when it's an 'a' tag without 'href'", () => {
    render(() => (
      <Button.Root data-testid="button">
        <As component="a">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("role", "button");
  });

  it("should have attribute 'tabindex=0' when it's not a native button", () => {
    render(() => (
      <Button.Root data-testid="button">
        <As component="div">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex=0' when it's an 'a' tag with 'href'", () => {
    render(() => (
      <Button.Root data-testid="button">
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
      <Button.Root data-testid="button" isDisabled>
        <As component="div">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("tabindex", "0");
  });

  it("should have correct 'disabled' attribute when disabled and it's a native button", () => {
    render(() => (
      <Button.Root data-testid="button" isDisabled>
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("disabled");
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("should have correct 'disabled' attribute when disabled and it's an input", () => {
    render(() => (
      <Button.Root data-testid="button" isDisabled>
        <As component="input">Button</As>
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("disabled");
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("should have correct 'disabled' attribute when disabled and it's not a native button nor input", () => {
    render(() => (
      <Button.Root data-testid="button" isDisabled>
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
      <Button.Root data-testid="button" isDisabled>
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("data-disabled");
  });
});
