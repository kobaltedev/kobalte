import {
  itHasSemanticClass,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { render, screen } from "solid-testing-library";

import { Divider } from "./divider";
import { DividerProps } from "./types";

const defaultProps: DividerProps = {
  labelPlacement: "center",
  orientation: "horizontal",
};

describe("Divider", () => {
  itRendersChildren(Divider as any, defaultProps);
  itSupportsClass(Divider as any, defaultProps);
  itHasSemanticClass(Divider as any, defaultProps, "kb-divider");
  itSupportsRef(Divider as any, defaultProps, HTMLHRElement);
  itSupportsStyle(Divider as any, defaultProps);

  it("should have attribute 'role=separator' when it's not a 'hr' tag.", () => {
    render(() => <Divider data-testid="divider">Label</Divider>);

    const divider = screen.getByTestId("divider");

    expect(divider).toHaveAttribute("role", "separator");
  });
});
