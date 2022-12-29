import { mergeDefaultProps } from "@kobalte/utils";
import { createSignal, ParentProps, splitProps } from "solid-js";

import { createListState } from "../list";
import { Popper, PopperOptions } from "../popper";
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
import { useMenuRootContext } from "./menu-root-context";

export interface MenuProps
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
}

/**
 * Container for menu items and nested menu, provide context for its children.
 */
export function Menu(props: ParentProps<MenuProps>) {
  const rootContext = useMenuRootContext();
  const parentDomCollectionContext = useOptionalDomCollectionContext();
  const parentMenuContext = useOptionalMenuContext();

  props = mergeDefaultProps({ placement: "bottom-start" }, props);

  const [local, others] = splitProps(props, ["isOpen", "defaultIsOpen", "onOpenChange"]);

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

  const open = (focusStrategy: FocusStrategy | undefined) => {
    setFocusStrategy(focusStrategy);
    disclosureState.open();
  };

  const close = () => {
    disclosureState.close();
  };

  const toggle = (focusStrategy: FocusStrategy | undefined) => {
    if (disclosureState.isOpen()) {
      close();
    } else {
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
    isOpen: disclosureState.isOpen,
    shouldMount: () => rootContext.forceMount() || disclosureState.isOpen(),
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
    registerItemToParentDomCollection: parentDomCollectionContext?.registerItem,
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
