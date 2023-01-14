import {
  checkAccessibility,
  itIsPolymorphic,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { render, screen } from "solid-testing-library";

import * as Alert from ".";

const defaultProps = {};

describe("Alert", () => {
  checkAccessibility([<Alert.Root>Alert</Alert.Root>]);
  itIsPolymorphic(Alert.Root as any, defaultProps);
  itRendersChildren(Alert.Root as any, defaultProps);
  itSupportsClass(Alert.Root as any, defaultProps);
  itSupportsRef(Alert.Root as any, defaultProps, HTMLDivElement);
  itSupportsStyle(Alert.Root as any, defaultProps);

  it("should have attribute 'role=alert'", () => {
    render(() => <Alert.Root>Alert</Alert.Root>);

    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
  });
});
