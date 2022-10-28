import { Component, ParentComponent } from "solid-js";
import { Fragment } from "solid-js/h/jsx-runtime";
import { render } from "solid-testing-library";

export function itHasSemanticClass<P>(
  Comp: Component<P>,
  requiredProps: P,
  semanticClass: string,
  Wrapper: ParentComponent = props => <Fragment>{props.children}</Fragment>
) {
  it("has semantic class", () => {
    const { container } = render(() => <Wrapper>{Comp(requiredProps)}</Wrapper>);

    expect(container.querySelector(`.${semanticClass}`)).toBeInTheDocument();
  });
}
