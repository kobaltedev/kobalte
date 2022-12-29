import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createSignal, createUniqueId, ParentProps, splitProps } from "solid-js";

import { createListState } from "../list";
import {
  CollectionItem,
  createDisclosureState,
  createRegisterId,
  focusSafely,
} from "../primitives";
import {
  createDomCollection,
  useOptionalDomCollectionContext,
} from "../primitives/create-dom-collection";
import { FocusStrategy } from "../selection";
import { MenuContext, MenuContextValue, useOptionalMenuContext } from "./menu-context";
import { Popper, PopperOptions } from "../popper";

export interface MenuRootProps
  extends Omit<PopperOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> {
  /** The controlled open state of the menu. */
  isOpen?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultIsOpen?: boolean;

  /** Event handler called when the open state of the menu changes. */
  onOpenChange?: (isOpen: boolean) => void;

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
  isModal?: boolean;

  /**
   * Used to force mounting the menu (portal, positioner and content) when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;

  /** Handler that is called when the user activates a menu item. */
  onAction?: (key: string) => void;
}

/**
 * Base component for a menu, provide context for its children.
 * Used to build dropdown menu, context menu and menubar.
 */
export function MenuRoot(props: ParentProps<MenuRootProps>) {
  const parentDomCollectionContext = useOptionalDomCollectionContext();
  const parentMenuContext = useOptionalMenuContext();
  const defaultId = `menu-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      placement: "bottom-start",
      isModal: parentMenuContext?.isModal() ?? true,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "id",
    "isOpen",
    "isModal",
    "defaultIsOpen",
    "onOpenChange",
    "onAction",
    "forceMount",
  ]);

  const [triggerId, setTriggerId] = createSignal<string>();
  const [contentId, setContentId] = createSignal<string>();

  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [contentRef, setContentRef] = createSignal<HTMLDivElement>();

  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy | boolean | undefined>(true);

  const [items, setItems] = createSignal<CollectionItem[]>([]);

  const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });

  const disclosureState = createDisclosureState({
    isOpen: () => local.isOpen,
    defaultIsOpen: () => local.defaultIsOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const listState = createListState({
    selectionMode: "none",
    dataSource: items,
  });

  const open = (focusStrategy?: FocusStrategy) => {
    setFocusStrategy(focusStrategy);
    disclosureState.open();
  };

  const close = (deep?: boolean) => {
    disclosureState.close();

    if (deep) {
      parentMenuContext?.close(deep);
    }
  };

  const toggle = (focusStrategy?: FocusStrategy) => {
    if (disclosureState.isOpen()) {
      close();
    } else {
      setFocusStrategy(focusStrategy);
      open(focusStrategy);
    }
  };

  const focusContent = () => {
    const content = contentRef();

    if (content) {
      focusSafely(content);
    }
  };

  const context: MenuContextValue = {
    isOpen: () => disclosureState.isOpen(),
    isModal: () => local.isModal!,
    shouldMount: () => local.forceMount || disclosureState.isOpen(),
    autoFocus: focusStrategy,
    listState: () => listState,
    parentMenuContext: () => parentMenuContext,
    triggerRef,
    contentRef,
    triggerId,
    contentId,
    setTriggerRef,
    setContentRef,
    open,
    close,
    toggle,
    focusContent,
    onAction: key => local.onAction?.(key),
    registerItemToParentDomCollection: parentDomCollectionContext?.registerItem,
    generateId: createGenerateId(() => local.id!),
    registerTriggerId: createRegisterId(setTriggerId),
    registerContentId: createRegisterId(setContentId),
  };

  return (
    <DomCollectionProvider>
      <MenuContext.Provider value={context}>
        <Popper anchorRef={triggerRef} contentRef={contentRef} {...others} />
      </MenuContext.Provider>
    </DomCollectionProvider>
  );
}
