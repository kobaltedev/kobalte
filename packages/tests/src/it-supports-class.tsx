/*!
 * Original code by Mantinedev
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/it-supports-classname.tsx
 */

import { Component, ParentComponent } from "solid-js";
import { Fragment } from "solid-js/h/jsx-runtime";
import { render } from "solid-testing-library";

export function itSupportsClass<P>(
  Comp: Component<P>,
  requiredProps: P,
  Wrapper: ParentComponent = props => <Fragment>{props.children}</Fragment>
) {
  it("supports class prop", () => {
    const { container } = render(() => (
      <Wrapper>
        <Comp {...requiredProps} class="test-class-name" />
      </Wrapper>
    ));

    expect(container.querySelector(".test-class-name")).toBeInTheDocument();
  });
}
