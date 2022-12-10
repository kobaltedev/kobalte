/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/HiddenSelect.tsx
 */

import { visuallyHiddenStyles } from "@kobalte/utils";
import { createEffect, For, Match, Show, Switch } from "solid-js";

import { useFormControlContext } from "../form-control";
import { createInteractionModality } from "../primitives";
import { useSelectContext } from "./select-context";

export interface HiddenSelectProps {
  /**
   * Describes the type of autocomplete functionality the input should provide if any.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete).
   */
  autoComplete?: string;
}

// In Safari, the <select> cannot have `display: none` or `hidden` for autofill to work.
// In Firefox, there must be a <label> to identify the <select> whereas other browsers
// seem to identify it just by surrounding text.
// The solution is to use <VisuallyHidden> to hide the elements, which clips the elements to a
// 1px rectangle. In addition, we hide from screen readers with aria-hidden, and make the <select>
// non tabbable with tabIndex={-1}.
//
// In mobile browsers, there are next/previous buttons above the software keyboard for navigating
// between fields in a form. These only support native form inputs that are tabbable. In order to
// support those, an additional hidden input is used to marshall focus to the button. It is tabbable
// except when the button is focused, so that shift tab works properly to go to the actual previous
// input in the form. Using the <select> for this also works, but Safari on iOS briefly flashes
// the native menu on focus, so this isn't ideal. A font-size of 16px or greater is required to
// prevent Safari from zooming in on the input when it is focused.
//
// If the current interaction modality is null, then the user hasn't interacted with the page yet.
// In this case, we set the tabIndex to -1 on the input element so that automated accessibility
// checkers don't throw false-positives about focusable elements inside an aria-hidden parent.
/**
 * Renders a hidden native `<select>` element, which can be used to support browser
 * form autofill, mobile form navigation, and native form submission.
 */
export function HiddenSelect(props: HiddenSelectProps) {
  const formControlContext = useFormControlContext();
  const context = useSelectContext();

  const modality = createInteractionModality();

  const selectionManager = () => context.listState().selectionManager();
  const collection = () => context.listState().collection();

  // If used in a <form>, use hidden inputs so the value can be submitted to a server.
  // If single selection mode and the collection isn't too big,
  // use a hidden <select> element for this so that browser autofill will work.
  // Otherwise, use <input type="hidden" />.
  return (
    <Switch fallback={null}>
      <Match
        when={selectionManager().selectionMode() === "single" && collection().getSize() <= 300}
      >
        <div style={visuallyHiddenStyles} aria-hidden="true">
          <input
            type="text"
            tabIndex={
              modality() == null || selectionManager().isFocused() || context.isOpen() ? -1 : 0
            }
            style={{ "font-size": "16px" }}
            required={formControlContext.isRequired()}
            disabled={formControlContext.isDisabled()}
            readOnly={formControlContext.isReadOnly()}
            onFocus={() => context.triggerRef()?.focus()}
          />
          <select
            tabIndex={-1}
            autocomplete={props.autoComplete}
            name={formControlContext.name()}
            required={formControlContext.isRequired()}
            disabled={formControlContext.isDisabled()}
            size={collection().getSize()}
            value={selectionManager().firstSelectedKey() ?? ""}
            onChange={e =>
              selectionManager().setSelectedKeys(new Set([(e.target as HTMLSelectElement).value]))
            }
          >
            <option />
            <For each={[...collection().getKeys()]}>
              {key => {
                const item = collection().getItem(key);
                if (item && item.type === "item") {
                  return <option value={item.key}>{item.label}</option>;
                }
              }}
            </For>
          </select>
        </div>
      </Match>
      <Match when={formControlContext.name() != null}>
        <For each={[...selectionManager().selectedKeys()]}>
          {key => (
            // TODO: should it be <input type="hidden" value="all"/> when all selected ?
            <input
              type="hidden"
              autocomplete={props.autoComplete}
              name={formControlContext.name()}
              required={formControlContext.isRequired()}
              disabled={formControlContext.isDisabled()}
              readOnly={formControlContext.isReadOnly()}
              value={key}
            />
          )}
        </For>
      </Match>
    </Switch>
  );
}
