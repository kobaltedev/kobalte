/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/types.ts
 */

import { Component, JSX } from "solid-js";

/** All HTML and SVG elements. */
export type DOMElements = keyof JSX.IntrinsicElements;

/** Any HTML element or SolidJS component. */
export type ElementType<Props = any> = DOMElements | Component<Props>;

/**
 * Allows for extending a set of props (`Source`) by an overriding set of props (`Override`),
 * ensuring that any duplicates are overridden by the overriding set of props.
 */
export type OverrideProps<Source = {}, Override = {}> = Omit<
  Source,
  keyof Override
> &
  Override;

export interface ClassProp {
  /** The HTML `class` attribute. */
  class?: string;
}

export type Dict<T = any> = Record<string, T>;

export type FilterFn<T> = (value: any, key: string, object: T) => boolean;
