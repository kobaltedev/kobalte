/*!
 * Original code by Mantinedev
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/it-supports-style.tsx
 */

import { Component, ParentComponent } from "solid-js";
import { Fragment } from "solid-js/h/jsx-runtime";
import { render } from "solid-testing-library";

export function itSupportsStyle<P>(
  Comp: Component<P>,
  requiredProps: P,
  selector?: string,
  Wrapper: ParentComponent = props => <Fragment>{props.children}</Fragment>
) {
  it("supports style property", async () => {
    const getTarget = (container: HTMLElement) => {
      return selector
        ? container.querySelector(selector)
        : (container.firstElementChild as HTMLElement);
    };

    const { container } = render(() => (
      <Wrapper>
        <Comp {...requiredProps} style={{ border: "1px solid cyan" }} />
      </Wrapper>
    ));

    expect(getTarget(container)).toHaveStyle({ border: "1px solid cyan" });
  });
}
