/*!
 * Original code by Mantinedev
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/check-accessibility.tsx
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { JSX } from "solid-js";
import { render } from "solid-testing-library";

const config = {
  rules: {
    region: {
      enabled: false,
    },

    "autocomplete-valid": {
      enabled: false,
    },
  },
};

export function checkAccessibility(elements: JSX.Element[]) {
  expect.extend(toHaveNoViolations);

  it("should not have accessibility violations", async () => {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const element of elements) {
      const { container } = await render(() => element);
      const result = await axe(container, config);
      expect(result).toHaveNoViolations();
    }
  }, 30000);
}
