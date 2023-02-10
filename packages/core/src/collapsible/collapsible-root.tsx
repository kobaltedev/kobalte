/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */

import { createGenerateId, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createDisclosureState, createRegisterId } from "../primitives";
import {
  CollapsibleContext,
  CollapsibleContextValue,
  CollapsibleDataSet,
} from "./collapsible-context";

export interface CollapsibleRootOptions {
  /** The controlled open state of the collapsible. */
  isOpen?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultIsOpen?: boolean;

  /** Event handler called when the open state of the collapsible changes. */
  onOpenChange?: (isOpen: boolean) => void;

  /** Whether the collapsible is disabled. */
  isDisabled?: boolean;

  /**
   * Used to force mounting the collapsible content when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * An interactive component which expands/collapses a content.
 */
export const CollapsibleRoot = createPolymorphicComponent<"div", CollapsibleRootOptions>(props => {
  const defaultId = `collapsible-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "isOpen",
    "defaultIsOpen",
    "onOpenChange",
    "isDisabled",
    "forceMount",
  ]);

  const [contentId, setContentId] = createSignal<string>();

  const disclosureState = createDisclosureState({
    isOpen: () => local.isOpen,
    defaultIsOpen: () => local.defaultIsOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const dataset: Accessor<CollapsibleDataSet> = createMemo(() => ({
    "data-expanded": disclosureState.isOpen() ? "" : undefined,
    "data-closed": !disclosureState.isOpen() ? "" : undefined,
    "data-disabled": local.isDisabled ? "" : undefined,
  }));

  const context: CollapsibleContextValue = {
    dataset,
    isOpen: disclosureState.isOpen,
    isDisabled: () => local.isDisabled ?? false,
    shouldMount: () => local.forceMount || disclosureState.isOpen(),
    contentId,
    toggle: disclosureState.toggle,
    generateId: createGenerateId(() => others.id!),
    registerContentId: createRegisterId(setContentId),
  };

  return (
    <CollapsibleContext.Provider value={context}>
      <Dynamic component={local.as} {...dataset()} {...others} />
    </CollapsibleContext.Provider>
  );
});
