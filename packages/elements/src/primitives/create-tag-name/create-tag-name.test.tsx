/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/main/packages/ariakit-utils/src/dom.ts
 */

import { createEffect } from "solid-js";
import { render } from "solid-testing-library";

import { createTagName } from "./create-tag-name";

describe("createTagName", () => {
  it("should use 'tagName' from ref", () => {
    let tagNameVal: string | undefined;

    const TestComponent = () => {
      let ref: HTMLDivElement | undefined;

      const tagName = createTagName(
        () => ref,
        () => "button"
      );

      createEffect(() => {
        tagNameVal = tagName();
      });

      return <div ref={ref} />;
    };

    render(() => <TestComponent />);

    expect(tagNameVal).toBe("div");
  });

  it("should use type as 'tagName' when ref is undefined", () => {
    let tagNameVal: string | undefined;

    const TestComponent = () => {
      let ref: HTMLDivElement | undefined;

      const tagName = createTagName(
        () => ref,
        () => "button"
      );

      createEffect(() => {
        tagNameVal = tagName();
      });

      return <div />;
    };

    render(() => <TestComponent />);

    expect(tagNameVal).toBe("button");
  });
});
