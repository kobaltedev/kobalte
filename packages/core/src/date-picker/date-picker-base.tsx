/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-types/datepicker/src/index.d.ts
 */

import { Calendar } from "@internationalized/date";
import {
  access,
  createGenerateId,
  mergeDefaultProps,
  OverrideComponentProps,
  ValidationState,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, JSX, splitProps } from "solid-js";

import { DateValue } from "../calendar/types";
import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { createMessageFormatter } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { PopperRoot, PopperRootOptions } from "../popper";
import {
  createDisclosureState,
  createFormResetListener,
  createPresence,
  createRegisterId,
} from "../primitives";
import { DATE_PICKER_INTL_MESSAGES } from "./date-picker.intl";
import {
  DatePickerContext,
  DatePickerContextValue,
  DatePickerDataSet,
} from "./date-picker-context";
import { DateFieldGranularity } from "./types";

export interface DatePickerBaseOptions
  extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange">,
    AsChildProp {
  /** The locale to display and edit the value according to. */
  locale: string;

  /**
   * A function that creates a [Calendar](https://react-spectrum.adobe.com/internationalized/date/Calendar.html)
   * object for a given calendar identifier. Such a function may be imported from the
   * `@internationalized/date` package, or manually implemented to include support for
   * only certain calendars.
   */
  createCalendar: (name: string) => Calendar;

  /** The controlled open state of the date picker. */
  open?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultOpen?: boolean;

  /** Event handler called when the open state of the date picker changes. */
  onOpenChange?: (isOpen: boolean) => void;

  /** The controlled value of the date picker. */
  value?: Array<DateValue>;

  /**
   * The value of the date picker when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: Array<DateValue>;

  /** Event handler called when the value changes. */
  onChange?: (value: Array<DateValue>) => void;

  /** The minimum allowed date that a user may select. */
  minValue?: DateValue;

  /** The maximum allowed date that a user may select. */
  maxValue?: DateValue;

  /**
   * Callback that is called for each date of the calendar.
   * If it returns true, then the date is unavailable.
   */
  isDateUnavailable?: (date: DateValue) => boolean;

  /**
   * A placeholder date that influences the format of the placeholder shown when no value is selected.
   * Defaults to today's date at midnight.
   */
  placeholderValue?: DateValue;

  /**
   * Whether to display the time in 12 or 24-hour format.
   * By default, this is determined by the user's locale.
   */
  hourCycle?: 12 | 24;

  /**
   * Determines the smallest unit that is displayed in the date picker.
   * By default, this is `"day"` for dates, and `"minute"` for times.
   */
  granularity?: DateFieldGranularity;

  /** Whether to hide the time zone abbreviation. */
  hideTimeZone?: boolean;

  /**
   * Whether the date picker should be the only visible content for screen readers.
   * When set to `true`:
   * - interaction with outside elements will be disabled.
   * - scroll will be locked.
   * - focus will be locked inside the select content.
   * - elements outside the date picker content will not be visible for screen readers.
   */
  modal?: boolean;

  /**
   * Used to force mounting the date picker (portal, positioner and content) when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /**
   * The name of the date picker.
   * Submitted with its owning form as part of a name/value pair.
   */
  name?: string;

  /** Whether the date picker should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must select a date before the owning form can be submitted. */
  required?: boolean;

  /** Whether the date picker is disabled. */
  disabled?: boolean;

  /** Whether the date picker is read only. */
  readOnly?: boolean;

  /** The children of the date picker. */
  children?: JSX.Element;
}

export interface DatePickerBaseProps
  extends OverrideComponentProps<"div", DatePickerBaseOptions>,
    AsChildProp {}

/**
 * Base component for a date picker, provide context for its children.
 */
export function DatePickerBase(props: DatePickerBaseProps) {
  const defaultId = `date-picker-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      gutter: 8,
      sameWidth: false,
      modal: false,
      placement: "bottom-start",
    },
    props
  );

  const [local, popperProps, formControlProps, others] = splitProps(
    props,
    [
      "locale",
      "createCalendar",
      "open",
      "defaultOpen",
      "onOpenChange",
      "value",
      "defaultValue",
      "onChange",
      "modal",
      "forceMount",
    ],
    [
      "getAnchorRect",
      "placement",
      "gutter",
      "shift",
      "flip",
      "slide",
      "overlap",
      "sameWidth",
      "fitViewport",
      "hideWhenDetached",
      "detachedPadding",
      "arrowPadding",
      "overflowPadding",
    ],
    FORM_CONTROL_PROP_NAMES
  );

  const [contentId, setContentId] = createSignal<string>();

  const [controlRef, setControlRef] = createSignal<HTMLDivElement>();
  const [inputRef, setInputRef] = createSignal<HTMLDivElement>();
  const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();
  const [contentRef, setContentRef] = createSignal<HTMLDivElement>();

  const messageFormatter = createMessageFormatter(() => DATE_PICKER_INTL_MESSAGES);

  const disclosureState = createDisclosureState({
    open: () => local.open,
    defaultOpen: () => local.defaultOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const contentPresence = createPresence(() => local.forceMount || disclosureState.isOpen());

  const { formControlContext } = createFormControl(formControlProps);

  createFormResetListener(inputRef, () => {
    // TODO: reset date picker
  });

  const dataset: Accessor<DatePickerDataSet> = createMemo(() => ({
    "data-expanded": disclosureState.isOpen() ? "" : undefined,
    "data-closed": !disclosureState.isOpen() ? "" : undefined,
  }));

  const context: DatePickerContextValue = {
    dataset,
    isOpen: disclosureState.isOpen,
    isDisabled: () => formControlContext.isDisabled() ?? false,
    isModal: () => local.modal ?? false,
    contentPresence,
    messageFormatter,
    locale: () => local.locale,
    contentId,
    controlRef,
    inputRef,
    triggerRef,
    contentRef,
    setControlRef,
    setInputRef,
    setTriggerRef,
    setContentRef,
    createCalendar: name => local.createCalendar(name),
    close: disclosureState.close,
    toggle: disclosureState.toggle,
    generateId: createGenerateId(() => access(formControlProps.id)!),
    registerContentId: createRegisterId(setContentId),
  };

  return (
    <FormControlContext.Provider value={formControlContext}>
      <DatePickerContext.Provider value={context}>
        <PopperRoot anchorRef={controlRef} contentRef={contentRef} {...popperProps}>
          <Polymorphic
            as="div"
            role="group"
            id={access(formControlProps.id)}
            {...formControlContext.dataset()}
            {...dataset()}
            {...others}
          />
        </PopperRoot>
      </DatePickerContext.Provider>
    </FormControlContext.Provider>
  );
}
