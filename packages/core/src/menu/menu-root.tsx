import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, ParentProps, splitProps } from "solid-js";

import { createDisclosureState } from "../primitives";
import { Menu, MenuOptions } from "./menu";
import { MenuRootContext, MenuRootContextValue } from "./menu-root-context";

export interface MenuRootOptions extends MenuOptions {
  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /**
   * Whether the menu should be the only visible content for screen readers.
   * When set to `true`:
   * - interaction with outside elements will be disabled.
   * - scroll will be locked.
   * - focus will be locked inside the menu content.
   * - elements outside the menu content will not be visible for screen readers.
   */
  modal?: boolean;

  /**
   * Used to force mounting the menu (portal, positioner and content) when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

export interface MenuRootProps extends ParentProps<MenuRootOptions> {}

/**
 * Root component for a menu, provide context for its children.
 * Used to build dropdown menu, context menu and menubar.
 */
export function MenuRoot(props: MenuRootProps) {
  const defaultId = `menu-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      modal: true,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "id",
    "modal",
    "forceMount",
    "open",
    "defaultOpen",
    "onOpenChange",
  ]);

  const disclosureState = createDisclosureState({
    open: () => local.open,
    defaultOpen: () => local.defaultOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const context: MenuRootContextValue = {
    isModal: () => local.modal ?? true,
    forceMount: () => local.forceMount ?? false,
    generateId: createGenerateId(() => local.id!),
  };

  return (
    <MenuRootContext.Provider value={context}>
      <Menu open={disclosureState.isOpen()} onOpenChange={disclosureState.setIsOpen} {...others} />
    </MenuRootContext.Provider>
  );
}
