import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { createSignal, For, Show } from "solid-js";

import { Calendar, createDateFormatter, I18nProvider } from "../src";

function CalendarPlayground(props: { months?: number; mode?: any }) {
  const [value, setValue] = createSignal<Array<CalendarDate>>([]);
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
        visibleDuration={{ months: props.months ?? 1 }}
        value={value()}
        onChange={setValue}
        selectionMode={props.mode ?? "single"}
      >
        <header class="header">
          <Calendar.PrevTrigger class="button">&lsaquo;</Calendar.PrevTrigger>
          <Calendar.Heading class="heading" />
          <Calendar.NextTrigger class="button">&rsaquo;</Calendar.NextTrigger>
        </header>
        <div style={{ display: "flex", gap: "8px", "align-items": "flex-start" }}>
          <For each={[...new Array(props.months ?? 1).keys()]}>
            {offset => (
              <Calendar.Grid class="grid" weekDayFormat="short" offset={{ months: offset }}>
                <Calendar.GridHeader>
                  <Calendar.HeaderRow>
                    {weekDay => <Calendar.HeaderCell>{weekDay}</Calendar.HeaderCell>}
                  </Calendar.HeaderRow>
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {weekIndex => (
                    <Calendar.Row weekIndex={weekIndex()}>
                      {date => (
                        <Show when={date()} fallback={<td />}>
                          <Calendar.Cell date={date()!}>
                            <Calendar.CellTrigger as="div" class="cell" />
                          </Calendar.Cell>
                        </Show>
                      )}
                    </Calendar.Row>
                  )}
                </Calendar.GridBody>
              </Calendar.Grid>
            )}
          </For>
        </div>
      </Calendar.Root>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider locale="en-US">
      <CalendarPlayground mode="single" />
      <CalendarPlayground mode="multiple" />
      <CalendarPlayground mode="range" months={2} />
    </I18nProvider>
  );
}
