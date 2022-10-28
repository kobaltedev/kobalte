import { ClassProp, ElementType, OverrideProps } from "@kobalte/utils";
import { ComponentProps, JSX, ParentProps } from "solid-js";

/** The `as` prop type. */
export type As<Props = any> = ElementType<Props>;

/** Props object that includes the `as` prop. */
export type PolymorphicProps<Type extends As = As, Props = {}> = OverrideProps<
  ComponentProps<Type>,
  ParentProps<Props & ClassProp & { as?: Type }>
>;

/** A component with the `as` prop. */
export type PolymorphicComponent<DefaultType extends As, Props = {}> = {
  <Type extends As>(
    props: PolymorphicProps<Type, Props> & { as: Type }
  ): JSX.Element;
  (props: PolymorphicProps<DefaultType, Props>): JSX.Element;
};
