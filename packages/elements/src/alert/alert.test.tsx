import {
  checkAccessibility,
  itIsPolymorphic,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { render, screen } from "solid-testing-library";

import { Alert } from "./alert";

const defaultProps = {};

describe("Button", () => {
  checkAccessibility([<Alert>Alert</Alert>]);
  itIsPolymorphic(Alert as any, defaultProps);
  itRendersChildren(Alert as any, defaultProps);
  itSupportsClass(Alert as any, defaultProps);
  itSupportsRef(Alert as any, defaultProps, HTMLDivElement);
  itSupportsStyle(Alert as any, defaultProps);

  it("should have attribute 'role=alert'", () => {
    render(() => <Alert>Alert</Alert>);

    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
  });
});
