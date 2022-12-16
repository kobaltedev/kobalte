/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-stately/tabs/src/useTabListState.ts
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTabList.ts
 */

import { createPolymorphicComponent, mergeDefaultProps, Orientation } from "@kobalte/utils";
import { createEffect, createSignal, createUniqueId, on, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createSingleSelectListState } from "../list";
import { createDomCollection } from "../primitives/create-dom-collection";
import { Tab } from "./tab";
import { TabList } from "./tab-list";
import { TabPanel } from "./tab-panel";
import { TabsContext, TabsContextValue } from "./tabs-context";
import { TabsActivationMode, TabsItemModel } from "./types";

type TabsComposite = {
  TabList: typeof TabList;
  Tab: typeof Tab;
  TabPanel: typeof TabPanel;
};

export interface TabsProps {
  /** The controlled value of the tab to activate. */
  value?: string;

  /**
   * The value of the tab that should be active when initially rendered.
   * Useful when you do not need to control the state.
   */
  defaultValue?: string;

  /** Event handler called when the value changes. */
  onValueChange?: (value: string) => void;

  /** The orientation of the tabs. */
  orientation?: Orientation;

  /** Whether tabs are activated automatically on focus or manually. */
  activationMode?: TabsActivationMode;

  /** Whether the tabs are disabled. */
  isDisabled?: boolean;
}

/**
 * A set of layered sections of content, known as tab panels, that display one panel of content at a time.
 * `Tabs` contains all the parts of a tabs component and provide context for its children.
 */
export const Tabs = createPolymorphicComponent<"div", TabsProps, TabsComposite>(props => {
  const defaultId = `tabs-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
      orientation: "horizontal",
      activationMode: "automatic",
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "value",
    "defaultValue",
    "onValueChange",
    "orientation",
    "activationMode",
    "isDisabled",
  ]);

  const [items, setItems] = createSignal<TabsItemModel[]>([]);

  const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });

  const listState = createSingleSelectListState({
    selectedKey: () => local.value,
    defaultSelectedKey: () => local.defaultValue,
    onSelectionChange: key => local.onValueChange?.(String(key)),
    dataSource: items,
    itemPropertyNames: {
      key: "value",
    },
  });

  let lastSelectedKey = listState.selectedKey();

  createEffect(
    on(
      [
        () => listState.selectionManager(),
        () => listState.collection(),
        () => listState.selectedKey(),
      ],
      ([selectionManager, collection, currentSelectedKey]) => {
        let selectedKey = currentSelectedKey;

        // Ensure a tab is always selected (in case no selected key was specified or if selected item was deleted from collection)
        if (selectionManager.isEmpty() || selectedKey == null || !collection.getItem(selectedKey)) {
          selectedKey = collection.getFirstKey();

          let selectedItem = selectedKey != null ? collection.getItem(selectedKey) : undefined;

          // loop over tabs until we find one that isn't disabled and select that
          while (selectedItem?.isDisabled && selectedItem.key !== collection.getLastKey()) {
            selectedKey = collection.getKeyAfter(selectedItem.key);
            selectedItem = selectedKey != null ? collection.getItem(selectedKey) : undefined;
          }

          // if this check is true, then every item is disabled, it makes more sense to default to the first key than the last
          if (selectedItem?.isDisabled && selectedKey === collection.getLastKey()) {
            selectedKey = collection.getFirstKey();
          }

          // directly set selection because replace/toggle selection won't consider disabled keys
          if (selectedKey != null) {
            selectionManager.setSelectedKeys([selectedKey]);
          }
        }

        // If there isn't a focused key yet or the tabs doesn't have focus and the selected key changes,
        // change focused key to the selected key if it exists.
        if (
          selectionManager.focusedKey() == null ||
          (!selectionManager.isFocused() && selectedKey !== lastSelectedKey)
        ) {
          selectionManager.setFocusedKey(selectedKey);
        }

        lastSelectedKey = selectedKey;
      }
    )
  );

  // associated value/tab ids
  const tabIdsMap = new Map<string, string>();

  // associated value/tab panel ids
  const tabPanelIdsMap = new Map<string, string>();

  const context: TabsContextValue = {
    isDisabled: () => local.isDisabled ?? false,
    orientation: () => local.orientation!,
    activationMode: () => local.activationMode!,
    tabIdsMap: () => tabIdsMap,
    tabPanelIdsMap: () => tabPanelIdsMap,
    listState: () => listState,
    generateTabId: value => `${others.id!}-tab-${value}`,
    generateTabPanelId: value => `${others.id!}-tabpanel-${value}`,
  };

  return (
    <DomCollectionProvider>
      <TabsContext.Provider value={context}>
        <Dynamic component={local.as} data-orientation={context.orientation()} {...others} />
      </TabsContext.Provider>
    </DomCollectionProvider>
  );
});

Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanel = TabPanel;
