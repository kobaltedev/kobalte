/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit/src/popover/popover-state.ts
 */

import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import {
  Accessor,
  createMemo,
  createSignal,
  createUniqueId,
  ParentProps,
  splitProps,
} from "solid-js";

import { PopperRoot, PopperRootOptions } from "../popper";
import { createDisclosureState, createPresence, createRegisterId } from "../primitives";
import { PopoverContext, PopoverContextValue, PopoverDataSet } from "./popover-context";

export interface PopoverRootOptions
  extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> {
  /**
   * A ref for the anchor element.
   * Useful if you want to use an element outside `Popover` as the popover anchor.
   */
  anchorRef?: Accessor<HTMLElement | undefined>;

  /** The controlled open state of the popover. */
  open?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultOpen?: boolean;

  /** Event handler called when the open state of the popover changes. */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /**
   * Whether the popover should be the only visible content for screen readers.
   * When set to `true`:
   * - interaction with outside elements will be disabled.
   * - scroll will be locked.
   * - focus will be locked inside the popover content.
   * - elements outside the popover content will not be visible for screen readers.
   */
  modal?: boolean;

  /**
   * Used to force mounting the popover (portal, positioner and content) when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

export interface PopoverRootProps extends ParentProps<PopoverRootOptions> {}

/**
 * A popover is a dialog positioned relative to an anchor element.
 */
export function PopoverRoot(props: PopoverRootProps) {
  const defaultId = `popover-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      modal: false,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "id",
    "open",
    "defaultOpen",
    "onOpenChange",
    "modal",
    "forceMount",
    "anchorRef",
  ]);

  const [defaultAnchorRef, setDefaultAnchorRef] = createSignal<HTMLElement>();
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [contentRef, setContentRef] = createSignal<HTMLElement>();

  const [contentId, setContentId] = createSignal<string>();
  const [titleId, setTitleId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const disclosureState = createDisclosureState({
    open: () => local.open,
    defaultOpen: () => local.defaultOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const anchorRef = () => {
    return local.anchorRef?.() ?? defaultAnchorRef() ?? triggerRef();
  };

  const contentPresence = createPresence(() => local.forceMount || disclosureState.isOpen());

  const dataset: Accessor<PopoverDataSet> = createMemo(() => ({
    "data-expanded": disclosureState.isOpen() ? "" : undefined,
    "data-closed": !disclosureState.isOpen() ? "" : undefined,
  }));

  const context: PopoverContextValue = {
    dataset,
    isOpen: disclosureState.isOpen,
    isModal: () => local.modal!,
    contentPresence,
    triggerRef,
    contentId,
    titleId,
    descriptionId,
    setDefaultAnchorRef,
    setTriggerRef,
    setContentRef,
    close: disclosureState.close,
    toggle: disclosureState.toggle,
    generateId: createGenerateId(() => local.id!),
    registerContentId: createRegisterId(setContentId),
    registerTitleId: createRegisterId(setTitleId),
    registerDescriptionId: createRegisterId(setDescriptionId),
  };

  return (
    <PopoverContext.Provider value={context}>
      <PopperRoot anchorRef={anchorRef} contentRef={contentRef} {...others} />
    </PopoverContext.Provider>
  );
}
