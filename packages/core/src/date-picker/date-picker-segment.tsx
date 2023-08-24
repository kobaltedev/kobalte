/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/datepicker/src/useDateSegment.ts
 */

import { CalendarDate, toCalendar } from "@internationalized/date";
import { NumberParser } from "@internationalized/number";
import {
  callHandler,
  getActiveElement,
  getScrollParent,
  getWindow,
  isIOS,
  isMac,
  mergeRefs,
  OverrideComponentProps,
  scrollIntoViewport,
} from "@kobalte/utils";
import {
  children,
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  on,
  onCleanup,
  Show,
  splitProps,
} from "solid-js";

import { useFormControlContext } from "../form-control";
import { createDateFormatter, createFilter } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import * as SpinButton from "../spin-button";
import { useDatePickerContext } from "./date-picker-context";
import { useDatePickerInputContext } from "./date-picker-input-context";
import { createDisplayNames } from "./display-names";
import { DateSegment } from "./types";

export interface DatePickerSegmentOptions extends AsChildProp {
  segment: DateSegment;
}

export interface DatePickerSegmentProps
  extends OverrideComponentProps<"div", DatePickerSegmentOptions> {}

export function DatePickerSegment(props: DatePickerSegmentProps) {
  let ref: HTMLDivElement | undefined;

  const formControlContext = useFormControlContext();
  const datePickerContext = useDatePickerContext();
  const inputContext = useDatePickerInputContext();

  const [local, others] = splitProps(props, [
    "ref",
    "segment",
    "children",
    "onKeyDown",
    "onBeforeInput",
    "onInput",
    "onFocus",
  ]);

  const [textValue, setTextValue] = createSignal(
    local.segment.isPlaceholder ? "" : local.segment.text,
  );

  const resolvedChildren = children(() => local.children);

  let enteredKeys = "";
  let composition: string | null = "";

  const displayNames = createDisplayNames();

  // spin buttons cannot be focused with VoiceOver on iOS.
  const touchPropOverrides = createMemo(() => {
    return (
      isIOS() || local.segment.type === "timeZoneName"
        ? {
            role: "textbox",
            "aria-valuemax": undefined,
            "aria-valuemin": undefined,
            "aria-valuetext": undefined,
            "aria-valuenow": undefined,
          }
        : {}
    ) as ComponentProps<"div">;
  });

  const firstSegment = createMemo(() => inputContext.segments().find(s => s.isEditable));

  // Prepend the label passed from the field to each segment name.
  // This is needed because VoiceOver on iOS does not announce groups.
  const name = createMemo(() => {
    return local.segment.type === "literal" ? "" : displayNames().of(local.segment.type);
  });

  const ariaLabel = createMemo(() => {
    return `${name()}${inputContext.ariaLabel() ? `, ${inputContext.ariaLabel()}` : ""}${
      inputContext.ariaLabelledBy() ? ", " : ""
    }`;
  });

  const ariaDescribedBy = createMemo(() => {
    // Only apply aria-describedby to the first segment, unless the field is invalid. This avoids it being
    // read every time the user navigates to a new segment.
    if (local.segment !== firstSegment() && formControlContext.validationState() !== "invalid") {
      return undefined;
    }

    return inputContext.ariaDescribedBy();
  });

  const isEditable = createMemo(() => {
    return (
      !formControlContext.isDisabled() &&
      !formControlContext.isReadOnly() &&
      local.segment.isEditable
    );
  });

  const inputMode = createMemo(() => {
    return formControlContext.isDisabled() ||
      local.segment.type === "dayPeriod" ||
      local.segment.type === "era" ||
      !isEditable()
      ? undefined
      : "numeric";
  });

  // Safari dayPeriod option doesn't work...
  const filter = createFilter({ sensitivity: "base" });

  const options = createMemo(() => inputContext.dateFormatterResolvedOptions());

  // Get a list of formatted era names so users can type the first character to choose one.
  const eraFormatter = createDateFormatter({
    year: "numeric",
    era: "narrow",
    timeZone: "UTC",
  });

  const monthDateFormatter = createDateFormatter(() => ({
    month: "long",
    timeZone: options().timeZone,
  }));

  const hourDateFormatter = createDateFormatter(() => ({
    hour: "numeric",
    hour12: options().hour12,
    timeZone: options().timeZone,
  }));

  const amPmFormatter = createDateFormatter({
    hour: "numeric",
    hour12: true,
  });

  const eras = createMemo(() => {
    if (local.segment.type !== "era") {
      return [];
    }

    const date = toCalendar(new CalendarDate(1, 1, 1), inputContext.calendar());
    const eras = inputContext
      .calendar()
      .getEras()
      .map(era => {
        const eraDate = date.set({ year: 1, month: 1, day: 1, era }).toDate("UTC");
        const parts = eraFormatter().formatToParts(eraDate);
        const formatted = parts.find(p => p.type === "era")?.value ?? "";
        return { era, formatted };
      });

    // Remove the common prefix from formatted values. This is so that in calendars with eras like
    // ERA0 and ERA1 (e.g. Ethiopic), users can press "0" and "1" to select an era. In other cases,
    // the first letter is used.
    const prefixLength = commonPrefixLength(eras.map(era => era.formatted));

    if (prefixLength) {
      for (const era of eras) {
        era.formatted = era.formatted.slice(prefixLength);
      }
    }

    return eras;
  });

  const am = createMemo(() => {
    const date = new Date();
    date.setHours(0);

    return (
      amPmFormatter()
        .formatToParts(date)
        .find(part => part.type === "dayPeriod")?.value ?? ""
    );
  });

  const pm = createMemo(() => {
    const date = new Date();
    date.setHours(12);

    return (
      amPmFormatter()
        .formatToParts(date)
        .find(part => part.type === "dayPeriod")?.value ?? ""
    );
  });

  const numberParser = createMemo(() => {
    return new NumberParser(datePickerContext.locale(), { maximumFractionDigits: 0 });
  });

  const onBackspaceKeyDown = () => {
    if (
      numberParser().isValidPartialNumber(local.segment.text) &&
      !formControlContext.isReadOnly() &&
      !local.segment.isPlaceholder
    ) {
      const newValue = local.segment.text.slice(0, -1);
      const parsed = numberParser().parse(newValue);
      if (newValue.length === 0 || parsed === 0) {
        inputContext.clearSegment(local.segment.type);
      } else {
        inputContext.setSegment(local.segment.type, parsed);
      }
      enteredKeys = newValue;
    } else if (local.segment.type === "dayPeriod") {
      inputContext.clearSegment(local.segment.type);
    }
  };

  const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    // Firefox does not fire selectstart for Ctrl/Cmd + A
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1742153
    if (e.key === "a" && (isMac() ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
    }

    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return;
    }

    switch (e.key) {
      case "Backspace":
      case "Delete": {
        // Safari on iOS does not fire beforeinput for the backspace key because the cursor is at the start.
        e.preventDefault();
        e.stopPropagation();
        onBackspaceKeyDown();
        break;
      }
    }
  };

  const onInputBase = (key: string) => {
    if (formControlContext.isDisabled() || formControlContext.isReadOnly()) {
      return;
    }

    const newValue = enteredKeys + key;

    switch (local.segment.type) {
      case "dayPeriod":
        if (filter.startsWith(am(), key)) {
          inputContext.setSegment("dayPeriod", 0);
        } else if (filter.startsWith(pm(), key)) {
          inputContext.setSegment("dayPeriod", 12);
        } else {
          break;
        }
        datePickerContext.focusManager().focusNext();
        break;
      case "era": {
        const matched = eras().find(e => filter.startsWith(e.formatted, key));
        if (matched) {
          inputContext.setSegment("era", +matched.era);
          datePickerContext.focusManager().focusNext();
        }
        break;
      }
      case "day":
      case "hour":
      case "minute":
      case "second":
      case "month":
      case "year": {
        if (!numberParser().isValidPartialNumber(newValue)) {
          return;
        }

        let numberValue = numberParser().parse(newValue);
        let segmentValue = numberValue;
        let allowsZero = local.segment.minValue === 0;
        if (local.segment.type === "hour" && inputContext.dateFormatterResolvedOptions().hour12) {
          switch (inputContext.dateFormatterResolvedOptions().hourCycle) {
            case "h11":
              if (numberValue > 11) {
                segmentValue = numberParser().parse(key);
              }
              break;
            case "h12":
              allowsZero = false;
              if (numberValue > 12) {
                segmentValue = numberParser().parse(key);
              }
              break;
          }

          if (local.segment.value != null && local.segment.value >= 12 && numberValue > 1) {
            numberValue += 12;
          }
        } else if (local.segment.maxValue != null && numberValue > local.segment.maxValue) {
          segmentValue = numberParser().parse(key);
        }

        if (isNaN(numberValue)) {
          return;
        }

        const shouldSetValue = segmentValue !== 0 || allowsZero;

        if (shouldSetValue) {
          inputContext.setSegment(local.segment.type, segmentValue);
        }

        if (
          (local.segment.maxValue != null && Number(numberValue + "0") > local.segment.maxValue) ||
          newValue.length >= String(local.segment.maxValue).length
        ) {
          enteredKeys = "";
          if (shouldSetValue) {
            datePickerContext.focusManager().focusNext();
          }
        } else {
          enteredKeys = newValue;
        }
        break;
      }
    }
  };

  const onBeforeInput: JSX.EventHandlerUnion<HTMLDivElement, InputEvent> = e => {
    callHandler(e, local.onBeforeInput);

    e.preventDefault();

    switch (e.inputType) {
      case "deleteContentBackward":
      case "deleteContentForward":
        if (
          numberParser().isValidPartialNumber(local.segment.text) &&
          !formControlContext.isReadOnly()
        ) {
          onBackspaceKeyDown();
        }
        break;
      case "insertCompositionText":
        if (ref) {
          // insertCompositionText cannot be canceled.
          // Record the current state of the element, so we can restore it in the `input` event below.
          composition = ref.textContent;

          // Safari gets stuck in a composition state unless we also assign to the value here.
          // eslint-disable-next-line no-self-assign
          ref.textContent = ref.textContent;
        }
        break;
      default:
        if (e.data != null) {
          onInputBase(e.data);
        }
        break;
    }
  };

  const onInput: JSX.EventHandlerUnion<HTMLDivElement, InputEvent> = e => {
    callHandler(e, local.onInput);

    const { inputType, data } = e;

    if (ref && data != null) {
      switch (inputType) {
        case "insertCompositionText":
          // Reset the DOM to how it was in the beforeinput event.
          ref.textContent = composition;

          // Android sometimes fires key presses of letters as composition events. Need to handle am/pm keys here too.
          // Can also happen e.g. with Pinyin keyboard on iOS.
          if (filter.startsWith(am(), data) || filter.startsWith(pm(), data)) {
            onInputBase(data);
          }
          break;
      }
    }
  };

  const onFocus: JSX.EventHandlerUnion<HTMLDivElement, FocusEvent> = e => {
    callHandler(e, local.onFocus);

    if (ref) {
      enteredKeys = "";
      scrollIntoViewport(ref, {
        containingElement: getScrollParent(ref),
      });

      // Collapse selection to start or Chrome won't fire input events.
      const selection = getWindow(ref).getSelection();
      selection?.collapse(ref);
    }
  };

  const onIncrement = () => {
    enteredKeys = "";
    inputContext.increment(local.segment.type);
  };

  const onDecrement = () => {
    enteredKeys = "";
    inputContext.decrement(local.segment.type);
  };

  const onIncrementPage = () => {
    enteredKeys = "";
    inputContext.incrementPage(local.segment.type);
  };

  const onDecrementPage = () => {
    enteredKeys = "";
    inputContext.decrementPage(local.segment.type);
  };

  const onDecrementToMin = () => {
    if (local.segment.minValue == null) {
      return;
    }

    enteredKeys = "";
    inputContext.setSegment(local.segment.type, local.segment.minValue);
  };

  const onIncrementToMax = () => {
    if (local.segment.maxValue == null) {
      return;
    }

    enteredKeys = "";
    inputContext.setSegment(local.segment.type, local.segment.maxValue);
  };

  createEffect(() => {
    const resolvedDateValue = inputContext.dateValue();

    if (resolvedDateValue) {
      if (local.segment.type === "month" && !local.segment.isPlaceholder) {
        const monthTextValue = monthDateFormatter().format(resolvedDateValue);
        setTextValue(prev =>
          monthTextValue !== prev ? `${prev} – ${monthTextValue}` : monthTextValue,
        );
      } else if (local.segment.type === "hour" && !local.segment.isPlaceholder) {
        setTextValue(hourDateFormatter().format(resolvedDateValue));
      }
    } else {
      setTextValue(local.segment.isPlaceholder ? "" : local.segment.text);
    }
  });

  createEffect(
    on([() => ref, () => datePickerContext.focusManager()], ([ref, focusManager]) => {
      const element = ref;

      onCleanup(() => {
        // If the focused segment is removed, focus the previous one, or the next one if there was no previous one.
        if (getActiveElement(element) === element) {
          const prev = focusManager.focusPrevious();

          if (!prev) {
            focusManager.focusNext();
          }
        }
      });
    }),
  );

  return (
    <Show
      when={local.segment.type !== "literal"}
      fallback={
        <Polymorphic as="div" aria-hidden={true} data-separator="" {...others}>
          {local.segment.text}
        </Polymorphic>
      }
    >
      <SpinButton.Root
        ref={mergeRefs(el => (ref = el), local.ref)}
        tabIndex={formControlContext.isDisabled() ? undefined : 0}
        value={local.segment.value}
        textValue={textValue()}
        minValue={local.segment.minValue}
        maxValue={local.segment.maxValue}
        validationState={formControlContext.validationState()}
        required={formControlContext.isRequired()}
        disabled={formControlContext.isDisabled()}
        readOnly={formControlContext.isReadOnly() || !local.segment.isEditable}
        contentEditable={isEditable()}
        inputMode={inputMode()}
        // @ts-ignore
        autocorrect={isEditable() ? "off" : undefined}
        autoCapitalize={isEditable() ? "off" : undefined}
        spellcheck={isEditable() ? false : undefined}
        enterkeyhint={isEditable() ? "next" : undefined}
        style={{ "caret-color": "transparent" }}
        aria-label={ariaLabel()}
        aria-labelledby={inputContext.ariaLabelledBy()}
        aria-describedby={ariaDescribedBy()}
        data-placeholder={local.segment.isPlaceholder ? "" : undefined}
        onKeyDown={onKeyDown}
        onBeforeInput={onBeforeInput}
        onInput={onInput}
        onFocus={onFocus}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onIncrementPage={onIncrementPage}
        onDecrementPage={onDecrementPage}
        onDecrementToMin={onDecrementToMin}
        onIncrementToMax={onIncrementToMax}
        {...datePickerContext.dataset()}
        {...formControlContext.dataset()}
        {...others}
        {...touchPropOverrides()}
      >
        <Show when={resolvedChildren()} fallback={local.segment.text}>
          {resolvedChildren()}
        </Show>
      </SpinButton.Root>
    </Show>
  );
}

function commonPrefixLength(strings: string[]): number {
  // Sort the strings, and compare the characters in the first and last to find the common prefix.
  strings.sort();

  const first = strings[0];
  const last = strings[strings.length - 1];

  for (let i = 0; i < first.length; i++) {
    if (first[i] !== last[i]) {
      return i;
    }
  }

  return 0;
}
