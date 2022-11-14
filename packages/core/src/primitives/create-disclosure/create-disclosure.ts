import { access, MaybeAccessor } from "@kobalte/utils";
import { Accessor } from "solid-js";

import { createControllableBooleanSignal } from "../create-controllable-signal";

export interface CreateDisclosureProps {
  /** The value to be used, in controlled mode. */
  open?: MaybeAccessor<boolean | undefined>;

  /** The initial value to be used, in uncontrolled mode. */
  defaultOpen?: MaybeAccessor<boolean | undefined>;

  /** A function that will be called when `open` value changes. */
  onOpenChange?: (isOpen: boolean) => void;
}

export interface CreateDisclosureResult {
  /** The open state. */
  open: Accessor<boolean>;

  /** A function to set the `open` state to `true`. */
  onOpen: () => void;

  /** A function to set the `open` state to `false`. */
  onClose: () => void;

  /** A function to toggle the `open` state between `true` and `false`. */
  onToggle: () => void;
}

/**
 * Provides state management for open, close and toggle scenarios.
 * Used to control the "open state" of components like Modal, Drawer, etc.
 */
export function createDisclosure(props: CreateDisclosureProps = {}): CreateDisclosureResult {
  const [open, setOpen] = createControllableBooleanSignal({
    value: () => access(props.open),
    defaultValue: () => !!access(props.defaultOpen),
    onChange: value => props.onOpenChange?.(value),
  });

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onToggle = () => {
    open() ? onClose() : onOpen();
  };

  return {
    open,
    onOpen,
    onClose,
    onToggle,
  };
}
