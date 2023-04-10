import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { createSignal, Show } from "solid-js";

import { Calendar, createDateFormatter, I18nProvider } from "../src";

function CalendarPlayground() {
  const [value, setValue] = createSignal([parseDate("2020-02-03")]);
  const formatter = createDateFormatter({ dateStyle: "short" });

  return (
    <div class="app">
      <p>
        Selected dates:{" "}
        {value()
          .map(date => formatter().format(date.toDate(getLocalTimeZone())))
          .join(", ")}
      </p>
      <Calendar.Root
        class="calendar"
        visibleDuration={{ months: 2 }}
        value={value()}
        onChange={setValue}
        selectionMode="multiple"
      >
        <header class="header">
          <Calendar.PrevTrigger class="button">&lsaquo;</Calendar.PrevTrigger>
          <Calendar.Heading class="heading" />
          <Calendar.NextTrigger class="button">&rsaquo;</Calendar.NextTrigger>
        </header>
        <div style={{ display: "flex", gap: "8px", "align-items": "flex-start" }}>
          <Calendar.Grid class="grid" weekDayFormat="short">
            <Calendar.GridHeader>
              <Calendar.HeaderRow>
                {weekDay => <Calendar.HeaderCell>{weekDay}</Calendar.HeaderCell>}
              </Calendar.HeaderRow>
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {weekIndex => (
                <Calendar.Row weekIndex={weekIndex}>
                  {date => (
                    <Show when={date} fallback={<td />}>
                      <Calendar.Cell date={date!}>
                        <Calendar.CellTrigger as="div" class="cell" />
                      </Calendar.Cell>
                    </Show>
                  )}
                </Calendar.Row>
              )}
            </Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.Grid class="grid" weekDayFormat="short" offset={{ months: 1 }}>
            <Calendar.GridHeader>
              <Calendar.HeaderRow>
                {weekDay => <Calendar.HeaderCell>{weekDay}</Calendar.HeaderCell>}
              </Calendar.HeaderRow>
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {weekIndex => (
                <Calendar.Row weekIndex={weekIndex}>
                  {date => (
                    <Show when={date} fallback={<td />}>
                      <Calendar.Cell date={date!}>
                        <Calendar.CellTrigger class="cell" />
                      </Calendar.Cell>
                    </Show>
                  )}
                </Calendar.Row>
              )}
            </Calendar.GridBody>
          </Calendar.Grid>
        </div>
      </Calendar.Root>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider locale="en-US">
      <CalendarPlayground />
    </I18nProvider>
  );
}
