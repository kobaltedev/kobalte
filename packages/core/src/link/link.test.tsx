import {
  checkAccessibility,
  createPointerEvent,
  installPointerEvent,
  itIsPolymorphic,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { fireEvent, render, screen } from "solid-testing-library";

import * as Link from ".";

const defaultProps: Link.LinkRootOptions = {};

describe("Link", () => {
  installPointerEvent();

  checkAccessibility([<Link.Root href="#">Link</Link.Root>]);
  itIsPolymorphic(Link.Root as any, defaultProps);
  itRendersChildren(Link.Root as any, defaultProps);
  itSupportsClass(Link.Root as any, defaultProps);
  itSupportsRef(Link.Root as any, defaultProps, HTMLAnchorElement);
  itSupportsStyle(Link.Root as any, defaultProps);

  it("should not have attribute 'role=link' when it's a native link", () => {
    render(() => <Link.Root data-testid="link">Link</Link.Root>);

    const link = screen.getByTestId("link");

    expect(link).not.toHaveAttribute("role", "link");
  });

  it("should have attribute 'role=link' when it's not a native link", () => {
    render(() => (
      <Link.Root data-testid="link" as="div">
        Link
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).toHaveAttribute("role", "link");
  });

  it("should have attribute 'tabindex=0' when it's not a native link and is not disabled", () => {
    render(() => (
      <Link.Root data-testid="link" as="div">
        Link
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex=0' when it's a native link ", () => {
    render(() => (
      <Link.Root data-testid="link" href="https://kobalte.dev">
        Link
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).not.toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex=0' when it's disabled", () => {
    render(() => (
      <Link.Root data-testid="link" as="div" isDisabled>
        Link
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).not.toHaveAttribute("tabindex", "0");
  });

  it("should have attribute 'aria-disabled=true' when disabled", () => {
    render(() => (
      <Link.Root data-testid="link" isDisabled>
        Link
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("should not have attribute 'data-active' and 'data-disabled' by default", async () => {
    render(() => <Link.Root data-testid="link">Link</Link.Root>);

    const link = screen.getByTestId("link");

    expect(link).not.toHaveAttribute("data-active");
    expect(link).not.toHaveAttribute("data-disabled");
  });

  it("should have attribute 'data-active' when pressed", async () => {
    render(() => <Link.Root data-testid="link">Link</Link.Root>);

    const link = screen.getByTestId("link");

    fireEvent(link, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
    await Promise.resolve();

    expect(link).toHaveAttribute("data-active");
  });

  it("should have attribute 'data-disabled' when disabled", () => {
    render(() => (
      <Link.Root data-testid="link" isDisabled>
        Link
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).toHaveAttribute("data-disabled");
  });
});
