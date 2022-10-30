import {
  MultiPartClassComposition,
  MultiPartVariantSelection,
} from "./composition";

export type ComponentConfig<
  Parts extends string = string,
  Variants extends Record<string, any> = {},
  Props extends MultiPartVariantSelection<Variants> = {},
  Keys extends keyof Props = never
> = {
  /** The default props to be passed to the component. */
  defaultProps?: Pick<Props, Keys>;

  /** A CSS class composition to be applied on the component. */
  classComposition?: Partial<MultiPartClassComposition<Parts, Variants>>;
};

export type ComponentsConfig = Record<string, ComponentConfig>;
