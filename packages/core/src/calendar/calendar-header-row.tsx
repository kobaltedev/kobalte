/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarGrid.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/react-aria-components/src/Calendar.tsx
 */

import { OverrideComponentProps } from "@kobalte/utils";
import { For, JSX, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useCalendarGridContext } from "./calendar-grid-context";

export interface CalendarHeaderRowOptions {
  /** A function to render a `<Calendar.HeaderCell>` for a weekday name. */
  children?: (weekDay: string) => JSX.Element;
}

export type CalendarHeaderRowProps = OverrideComponentProps<"tr", CalendarHeaderRowOptions>;

/**
 * A calendar header row displays week day names inside a `Calendar.GridHeader`.
 */
export function CalendarHeaderRow(props: CalendarHeaderRowProps) {
  const [local, others] = splitProps(props, ["children"]);

  const context = useCalendarGridContext();

  return (
    <Polymorphic as="tr" {...others}>
      <For each={context.weekDays()}>{weekDay => local.children?.(weekDay)}</For>
    </Polymorphic>
  );
}
