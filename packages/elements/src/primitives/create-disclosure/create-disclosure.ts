import { access, MaybeAccessor } from "@kobalte/utils";
import { Accessor } from "solid-js";

import { createControllableBooleanSignal } from "../create-controllable-signal";

export interface CreateDisclosureProps {
  /** The value to be used, in controlled mode. */
  isOpen?: MaybeAccessor<boolean | undefined>;

  /** The initial value to be used, in uncontrolled mode. */
  defaultIsOpen?: MaybeAccessor<boolean | undefined>;

  /** A function that will be called when the `isOpen` state changes. */
  onOpenChange?: (isOpen: boolean) => void;
}

export interface CreateDisclosureResult {
  /** The open state. */
  isOpen: Accessor<boolean>;

  /** A function to set the `isOpen` state to `true`. */
  open: () => void;

  /** A function to set the `isOpen` state to `false`. */
  close: () => void;

  /** A function to toggle the `isOpen` state between `true` and `false`. */
  toggle: () => void;
}

/**
 * Provides state management for open, close and toggle scenarios.
 * Used to control the "open state" of components like Modal, Drawer, etc.
 */
export function createDisclosure(props: CreateDisclosureProps = {}): CreateDisclosureResult {
  const [isOpen, setIsOpen] = createControllableBooleanSignal({
    value: () => access(props.isOpen),
    defaultValue: () => !!access(props.defaultIsOpen),
    onChange: value => props.onOpenChange?.(value),
  });

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    isOpen() ? close() : open();
  };

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
