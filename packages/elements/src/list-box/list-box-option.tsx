/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/listbox/src/useOption.ts
 */

import {
  createPolymorphicComponent,
  isMac,
  isWebKit,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createCollectionItem } from "../primitives";
import {
  ListBoxOptionContext,
  ListBoxOptionContextValue,
  ListBoxOptionDataSet,
  useListBoxContext,
} from "./list-box-context";
import { ListBoxItem } from "./types";

export interface ListBoxOptionProps {
  /** The value of the option. */
  value: string;

  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the .textContent of the ListBox.OptionLabel part.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;

  /** Whether the option is disabled. */
  isDisabled?: boolean;
}

/**
 * An option of the listbox.
 */
export const ListBoxOption = createPolymorphicComponent<"li", ListBoxOptionProps>(props => {
  let ref: HTMLLIElement | undefined;

  const listBoxContext = useListBoxContext();

  const defaultId = `${listBoxContext.generateId("option")}-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "li",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "value",
    "textValue",
    "isDisabled",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
  ]);

  const [labelId, setLabelId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const [labelRef, setLabelRef] = createSignal<HTMLElement>();

  createCollectionItem<ListBoxItem>({
    ref: () => ref,
    getItem: item => ({
      ...item,
      value: () => local.value,
      textValue: () => {
        return local.textValue ?? labelRef()?.textContent ?? ref?.textContent ?? undefined;
      },
      isDisabled: () => local.isDisabled,
    }),
    shouldRegisterItem: () => !local.isDisabled,
  });

  // Safari with VoiceOver on macOS misreads options with aria-labelledby or aria-label as simply "text".
  // We should not map slots to the label and description on Safari and instead just have VoiceOver read the textContent.
  // https://bugs.webkit.org/show_bug.cgi?id=209279
  const canUseAriaLabels = createMemo(() => !(isMac() && isWebKit()));

  const dataset: Accessor<ListBoxOptionDataSet> = createMemo(() => ({}));

  const context: ListBoxOptionContextValue = {
    dataset,
    setLabelRef,
    generateId: part => `${others.id!}-${part}`,
    registerLabel: id => {
      setLabelId(id);
      return () => setLabelId(undefined);
    },
    registerDescription: id => {
      setDescriptionId(id);
      return () => setDescriptionId(undefined);
    },
  };

  return (
    <ListBoxOptionContext.Provider value={context}>
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => (ref = el), local.ref)}
        role="option"
        aria-disabled={local.isDisabled ? true : undefined}
        aria-label={canUseAriaLabels() ? local["aria-label"] : undefined}
        aria-labelledby={canUseAriaLabels() ? local["aria-labelledby"] || labelId() : undefined}
        aria-describedby={
          canUseAriaLabels() ? local["aria-describedby"] || descriptionId() : undefined
        }
        {...listBoxContext.dataset()}
        {...others}
      />
    </ListBoxOptionContext.Provider>
  );
});
