import {
  itHasSemanticClass,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { render, screen } from "solid-testing-library";

import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { ButtonGroupProps } from "./types";

const defaultProps: ButtonGroupProps = {};

describe("ButtonGroup", () => {
  itRendersChildren(ButtonGroup as any, defaultProps);
  itSupportsClass(ButtonGroup as any, defaultProps);
  itHasSemanticClass(ButtonGroup as any, defaultProps, "kb-button-group");
  itSupportsRef(ButtonGroup as any, defaultProps, HTMLDivElement);
  itSupportsStyle(ButtonGroup as any, defaultProps);

  it("should have attribute 'role=group'", () => {
    render(() => (
      <ButtonGroup data-testid="button-group">
        <Button>Button A</Button>
        <Button>Button B</Button>
      </ButtonGroup>
    ));

    const buttonGroup = screen.getByTestId("button-group");

    expect(buttonGroup).toHaveAttribute("role", "group");
  });
});
