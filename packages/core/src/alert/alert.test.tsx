import { render, screen } from "@solidjs/testing-library";

import * as Alert from ".";

describe("Alert", () => {
  it("should have attribute 'role=alert'", () => {
    render(() => <Alert.Root>Alert</Alert.Root>);

    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
  });
});
