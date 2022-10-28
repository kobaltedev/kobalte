import { Component } from "solid-js";

import { As, PolymorphicComponent, PolymorphicProps } from "./types";

/** Create a polymorphic component with the `as` prop support. */
export function createPolymorphicComponent<
  DefaultType extends As,
  Props = {},
  Composite = {}
>(component: Component<PolymorphicProps<DefaultType, Props>>) {
  return component as unknown as PolymorphicComponent<DefaultType, Props> &
    Composite;
}
