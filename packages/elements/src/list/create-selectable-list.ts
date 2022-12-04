/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableList.ts
 */

import { access, MaybeAccessor } from "@kobalte/utils";
import { Accessor } from "solid-js";

import { createCollator } from "../i18n";
import { Collection, CollectionNode } from "../primitives";
import { createSelectableCollection, FocusStrategy, MultipleSelectionManager } from "../selection";
import { ListKeyboardDelegate } from "./list-keyboard-delegate";

export interface CreateSelectableListProps {
  /** State of the collection. */
  collection: Accessor<Collection<CollectionNode>>;

  /** An interface for reading and updating multiple selection state. */
  selectionManager: MaybeAccessor<MultipleSelectionManager>;

  /** Whether the collection or one of its items should be automatically focused upon render. */
  autoFocus?: MaybeAccessor<boolean | FocusStrategy | undefined>;

  /** Whether focus should wrap around when the end/start is reached. */
  shouldFocusWrap?: MaybeAccessor<boolean | undefined>;

  /** Whether the option is contained in a virtual scroller. */
  isVirtualized?: MaybeAccessor<boolean | undefined>;

  /** Whether the collection allows empty selection. */
  disallowEmptySelection?: MaybeAccessor<boolean | undefined>;

  /** Whether selection should occur automatically on focus. */
  selectOnFocus?: MaybeAccessor<boolean | undefined>;

  /** Whether typeahead is disabled. */
  disallowTypeAhead?: MaybeAccessor<boolean | undefined>;

  /** Whether navigation through tab key is enabled. */
  allowsTabNavigation?: MaybeAccessor<boolean | undefined>;
}

/**
 * Handles interactions with a selectable list.
 * @param props Props for the list.
 * @param ref A ref to the list element.
 */
export function createSelectableList<T extends HTMLElement>(
  props: CreateSelectableListProps,
  ref: Accessor<T | undefined>
) {
  const collator = createCollator({ usage: "search", sensitivity: "base" });

  // A KeyboardDelegate which uses the DOM to query layout information (e.g. for page up/page down).
  const delegate = new ListKeyboardDelegate(props.collection, ref, collator);

  return createSelectableCollection(
    {
      keyboardDelegate: delegate,
      selectionManager: () => access(props.selectionManager),
      autoFocus: () => access(props.autoFocus),
      shouldFocusWrap: () => access(props.shouldFocusWrap),
      disallowEmptySelection: () => access(props.disallowEmptySelection),
      selectOnFocus: () => access(props.selectOnFocus),
      disallowTypeAhead: () => access(props.disallowTypeAhead),
      allowsTabNavigation: () => access(props.allowsTabNavigation),
      isVirtualized: () => access(props.isVirtualized),
    },
    ref
  );
}
