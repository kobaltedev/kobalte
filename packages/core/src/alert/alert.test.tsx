import { render } from "@solidjs/testing-library";

import * as Alert from ".";

describe("Alert", () => {
	it("should have attribute 'role=alert'", () => {
		const { getByRole } = render(() => <Alert.Root>Alert</Alert.Root>);

		const alert = getByRole("alert");

		expect(alert).toBeInTheDocument();
	});
});
