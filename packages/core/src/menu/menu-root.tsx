import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentProps, splitProps } from "solid-js";

import { createListState } from "../list";
import { Popover, PopoverProps } from "../popover";
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

export interface MenuRootProps extends Omit<PopoverProps, "onCurrentPlacementChange"> {
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
    "children",
    "isOpen",
    "defaultIsOpen",
    "onOpenChange",
    "onAction",
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
    isModal: () => others.isModal!,
    autoFocus: focusStrategy,
    listState: () => listState,
    parentMenuContext: () => parentMenuContext,
    triggerRef,
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
        <Popover
          id={local.id}
          isOpen={disclosureState.isOpen()}
          onOpenChange={disclosureState.setIsOpen}
          anchorRef={triggerRef}
          {...others}
        >
          {local.children}
        </Popover>
      </MenuContext.Provider>
    </DomCollectionProvider>
  );
}
