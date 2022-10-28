/*!
 * Original code by Mantinedev
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/it-is-polymorphic.tsx
 */

import { Component, ParentComponent } from "solid-js";
import { Fragment } from "solid-js/h/jsx-runtime";
import { render } from "solid-testing-library";

export function itIsPolymorphic<P>(
  Comp: Component<P>,
  requiredProps: P,
  selector?: string,
  Wrapper: ParentComponent = props => <Fragment>{props.children}</Fragment>
) {
  it("is polymorphic", () => {
    const getTarget = (container: HTMLElement) => {
      return selector ? container.querySelector(selector) : (container.firstChild as HTMLElement);
    };

    const TestComponent = (props: any) => {
      return <mark data-test-prop {...props} />;
    };

    const { container: withTag } = render(() => (
      <Wrapper>
        <Comp as="a" href="https://kobalte.com" {...requiredProps} />
      </Wrapper>
    ));

    const { container: withComponent } = render(() => (
      <Wrapper>
        <Comp as={TestComponent} {...requiredProps} />
      </Wrapper>
    ));

    expect(getTarget(withTag)?.tagName).toBe("A");
    expect(getTarget(withComponent)?.tagName).toBe("MARK");
  });
}
