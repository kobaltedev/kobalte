/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit/src/popover/popover-state.ts
 */

import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import { Popper, PopperOptions } from "../popper";
import { createDisclosureState, createRegisterId } from "../primitives";
import { PopoverAnchor } from "./popover-anchor";
import { PopoverCloseButton } from "./popover-close-button";
import { PopoverContent } from "./popover-content";
import { PopoverContext, PopoverContextValue } from "./popover-context";
import { PopoverDescription } from "./popover-description";
import { PopoverPortal } from "./popover-portal";
import { PopoverTitle } from "./popover-title";
import { PopoverTrigger } from "./popover-trigger";

type PopoverComposite = {
  Trigger: typeof PopoverTrigger;
  Anchor: typeof PopoverAnchor;
  Portal: typeof PopoverPortal;
  Content: typeof PopoverContent;
  Arrow: typeof Popper.Arrow;
  CloseButton: typeof PopoverCloseButton;
  Title: typeof PopoverTitle;
  Description: typeof PopoverDescription;
};

export interface PopoverOptions
  extends Omit<PopperOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> {
  /**
   * A ref for the anchor element.
   * Useful if you want to use an element outside `Popover` as the popover anchor.
   */
  anchorRef?: Accessor<HTMLElement | undefined>;

  /** The controlled open state of the popover. */
  isOpen?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultIsOpen?: boolean;

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
  isModal?: boolean;

  /**
   * Used to force mounting the popover (portal, positioner and content) when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * A popover is a dialog positioned relative to an anchor element.
 */
export const Popover: ParentComponent<PopoverOptions> & PopoverComposite = props => {
  const defaultId = `popover-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      isModal: false,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "id",
    "isOpen",
    "defaultIsOpen",
    "onOpenChange",
    "isModal",
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
    isOpen: () => local.isOpen,
    defaultIsOpen: () => local.defaultIsOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const anchorRef = () => {
    return local.anchorRef?.() ?? defaultAnchorRef() ?? triggerRef();
  };

  const context: PopoverContextValue = {
    isOpen: disclosureState.isOpen,
    isModal: () => local.isModal!,
    shouldMount: () => local.forceMount || disclosureState.isOpen(),
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
      <Popper anchorRef={anchorRef} contentRef={contentRef} {...others} />
    </PopoverContext.Provider>
  );
};

Popover.Trigger = PopoverTrigger;
Popover.Anchor = PopoverAnchor;
Popover.Portal = PopoverPortal;
Popover.Content = PopoverContent;
Popover.Arrow = Popper.Arrow;
Popover.CloseButton = PopoverCloseButton;
Popover.Title = PopoverTitle;
Popover.Description = PopoverDescription;
