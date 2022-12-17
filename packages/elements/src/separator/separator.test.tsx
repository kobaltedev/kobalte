import { render, screen } from "solid-testing-library";

import { Separator } from "./separator";

describe("Separator", () => {
  it("should render an 'hr' by default", () => {
    render(() => <Separator />);

    const separator = screen.getByRole("separator");

    expect(separator).toBeInstanceOf(HTMLHRElement);
  });

  it("should not have implicit 'aria-orientation' by default", () => {
    render(() => <Separator />);

    const separator = screen.getByRole("separator");

    expect(separator).not.toHaveAttribute("aria-orientation");
  });

  it("should not have implicit 'role=separator' by default", () => {
    render(() => <Separator />);

    const separator = screen.getByRole("separator");

    expect(separator).not.toHaveAttribute("role", "separator");
  });

  it("should not have implicit 'aria-orientation' when 'orientation=horizontal'", () => {
    render(() => <Separator orientation="horizontal" />);

    const separator = screen.getByRole("separator");

    expect(separator).not.toHaveAttribute("aria-orientation");
  });

  it("should have 'aria-orientation' set to vertical when 'orientation=vertical'", () => {
    render(() => <Separator orientation="vertical" />);

    const separator = screen.getByRole("separator");

    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });

  it("should have 'role=separator' when rendered element is not 'hr'", () => {
    render(() => <Separator as="span" />);

    const separator = screen.getByRole("separator");

    expect(separator).toBeInstanceOf(HTMLSpanElement);
    expect(separator).toHaveAttribute("role", "separator");
  });
});
