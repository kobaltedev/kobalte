/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/utils/src/useLabels.ts
 */

import { access, MaybeAccessor } from "@solid-primitives/utils";
import { createMemo, createUniqueId, JSX } from "solid-js";
import Accessor = JSX.Accessor;

export interface MergeAriaLabelsProps {
  /**
   * The element's unique identifier.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
   */
  id?: MaybeAccessor<string | undefined>;

  /** Defines a string value that labels the current element. */
  ariaLabel?: MaybeAccessor<string | undefined>;

  /** Identifies the element (or elements) that labels the current element. */
  ariaLabelledBy?: MaybeAccessor<string | undefined>;
}

export interface AriaLabelsResult {
  /**
   * The element's unique identifier.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
   */
  id: Accessor<string>;

  /** Defines a string value that labels the current element. */
  ariaLabel: Accessor<string | undefined>;

  /** Identifies the element (or elements) that labels the current element. */
  ariaLabelledBy: Accessor<string | undefined>;
}

/**
 * Merges aria-label and aria-labelledby into aria-labelledby when both exist.
 * @param props - Aria label props.
 * @param defaultAriaLabel - Default value for aria-label when not present.
 */
export function mergeAriaLabels(
  props: MergeAriaLabelsProps,
  defaultAriaLabel?: MaybeAccessor<string | undefined>
): AriaLabelsResult {
  const defaultId = `kb-${createUniqueId()}`;

  const id = createMemo(() => access(props.id) ?? defaultId);

  const ariaLabelledBy = createMemo(() => {
    const label = access(props.ariaLabel);
    let labelledBy = access(props.ariaLabelledBy);

    // If there is both an aria-label and aria-labelledby,
    // combine them by pointing to the element itself.
    // ex: `<input id="foo" aria-label="Email" aria-labelledby="foo" />`
    if (labelledBy && label) {
      const ids = new Set([...labelledBy.trim().split(/\s+/), id()]);
      labelledBy = [...ids].join(" ");
    } else if (labelledBy) {
      labelledBy = labelledBy.trim().split(/\s+/).join(" ");
    }

    return labelledBy;
  });

  const ariaLabel = createMemo(() => {
    const defaultLabel = access(defaultAriaLabel);
    const label = access(props.ariaLabel);

    // If no labels are provided, use the default
    if (!label && !ariaLabelledBy() && defaultLabel) {
      return defaultLabel;
    }

    return label;
  });

  return { id, ariaLabel, ariaLabelledBy };
}
