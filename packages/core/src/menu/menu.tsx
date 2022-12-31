import { contains, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, createSignal, onCleanup, ParentProps, splitProps } from "solid-js";

import { createListState } from "../list";
import { Popper, PopperOptions } from "../popper";
import {
  debugPolygon,
  getElementPolygon,
  getEventPoint,
  isPointInPolygon,
  Polygon,
} from "../popper/polygon";
import { Placement } from "../popper/utils";
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
import { isServer } from "solid-js/web";

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

  props = mergeDefaultProps(
    {
      placement: parentMenuContext != null ? "right-start" : "bottom-start",
    },
    props
  );

  const [local, others] = splitProps(props, ["isOpen", "defaultIsOpen", "onOpenChange"]);

  const nestedMenus = new Set<Element>([]);

  const [triggerId, setTriggerId] = createSignal<string>();
  const [contentId, setContentId] = createSignal<string>();

  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [contentRef, setContentRef] = createSignal<HTMLDivElement>();

  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy | boolean>(true);

  const [currentPlacement, setCurrentPlacement] = createSignal<Placement>(others.placement!);

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

  const open = (focusStrategy: FocusStrategy | boolean) => {
    setFocusStrategy(focusStrategy);
    disclosureState.open();
  };

  const close = () => {
    disclosureState.close();
  };

  const toggle = (focusStrategy: FocusStrategy | boolean) => {
    setFocusStrategy(focusStrategy);
    disclosureState.toggle();
  };

  const focusContent = (key?: string) => {
    const content = contentRef();

    if (content) {
      focusSafely(content);
      listState.selectionManager().setFocused(true);
      listState.selectionManager().setFocusedKey(key);
    }
  };

  const registerNestedMenu = (element: Element) => {
    nestedMenus.add(element);

    const parentUnregister = parentMenuContext?.registerNestedMenu(element);

    return () => {
      nestedMenus.delete(element);
      parentUnregister?.();
    };
  };

  const isTargetInNestedMenu = (target: Element) => {
    return [...nestedMenus].some(menu => contains(menu, target));
  };

  const isPointInSafeArea = (e: PointerEvent) => {
    const triggerEl = triggerRef();
    const contentEl = contentRef();

    if (!triggerEl || !contentEl) {
      return false;
    }

    const polygon = getElementPolygon(currentPlacement(), triggerEl, contentEl);

    return isPointInPolygon(getEventPoint(e), polygon);
  };

  createEffect(() => {
    const contentEl = contentRef();

    if (!contentEl || !parentMenuContext) {
      return;
    }

    const parentUnregister = parentMenuContext.registerNestedMenu(contentEl);

    onCleanup(() => {
      parentUnregister();
    });
  });

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
    isPointInSafeArea,
    isTargetInNestedMenu,
    registerNestedMenu,
    registerItemToParentDomCollection: parentDomCollectionContext?.registerItem,
    registerTriggerId: createRegisterId(setTriggerId),
    registerContentId: createRegisterId(setContentId),
  };

  return (
    <DomCollectionProvider>
      <MenuContext.Provider value={context}>
        <Popper
          anchorRef={triggerRef}
          contentRef={contentRef}
          onCurrentPlacementChange={setCurrentPlacement}
          {...others}
        />
      </MenuContext.Provider>
    </DomCollectionProvider>
  );
}
