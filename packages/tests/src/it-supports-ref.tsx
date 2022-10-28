/*!
 * Original code by Mantinedev
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/it-supports-ref.tsx
 */

import { Component, ParentComponent } from "solid-js";
import { Fragment } from "solid-js/h/jsx-runtime";
import { render } from "solid-testing-library";

export function itSupportsRef<P>(
  Comp: Component<P>,
  requiredProps: P,
  refType: any,
  refProp = "ref",
  Wrapper: ParentComponent = props => <Fragment>{props.children}</Fragment>
) {
  it(refProp ? `supports getting ref with ${refProp} prop` : "supports ref", async () => {
    let ref: typeof refType;

    render(() => (
      <Wrapper>
        <Comp {...requiredProps} ref={ref} />
      </Wrapper>
    ));

    await Promise.resolve();

    expect(ref).toBeInstanceOf(refType);
  });
}
