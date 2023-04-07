import { installPointerEvent } from "@kobalte/tests";
import { render, screen } from "@solidjs/testing-library";

import { As } from "../polymorphic";
import * as Link from ".";

describe("Link", () => {
  installPointerEvent();

  it("should not have attribute 'role=link' when it's a native link", () => {
    render(() => <Link.Root data-testid="link">Link</Link.Root>);

    const link = screen.getByTestId("link");

    expect(link).not.toHaveAttribute("role", "link");
  });

  it("should have attribute 'role=link' when it's not a native link", () => {
    render(() => (
      <Link.Root data-testid="link" asChild>
        <As component="div">Link</As>
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).toHaveAttribute("role", "link");
  });

  it("should have attribute 'tabindex=0' when it's not a native link and is not disabled", () => {
    render(() => (
      <Link.Root data-testid="link" asChild>
        <As component="div">Link</As>
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
      <Link.Root data-testid="link" disabled asChild>
        <As component="div">Link</As>
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).not.toHaveAttribute("tabindex", "0");
  });

  it("should have attribute 'aria-disabled=true' when disabled", () => {
    render(() => (
      <Link.Root data-testid="link" disabled>
        Link
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("should not have attribute 'data-disabled' by default", async () => {
    render(() => <Link.Root data-testid="link">Link</Link.Root>);

    const link = screen.getByTestId("link");

    expect(link).not.toHaveAttribute("data-disabled");
  });

  it("should have attribute 'data-disabled' when disabled", () => {
    render(() => (
      <Link.Root data-testid="link" disabled>
        Link
      </Link.Root>
    ));

    const link = screen.getByTestId("link");

    expect(link).toHaveAttribute("data-disabled");
  });
});
