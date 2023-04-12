import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { createSignal, For, Show } from "solid-js";

import { DatePicker, createDateFormatter, I18nProvider } from "../src";

function CalendarPlayground(props: { months?: number; mode?: any }) {
  const [value, setValue] = createSignal<Array<CalendarDate>>([]);
  const formatter = createDateFormatter({ dateStyle: "short" });

  return (
    <>
      <p>
        Selected dates:{" "}
        {value()
          .map(date => formatter().format(date.toDate(getLocalTimeZone())))
          .join(", ")}
      </p>
      <DatePicker.Root>
        <DatePicker.Control class="control">
          <input type="text" />
          <DatePicker.Trigger>🗓</DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Portal>
          <DatePicker.Content class="content">
            {/* <DatePicker.Arrow /> */}
            <DatePicker.Calendar class="calendar">
              <DatePicker.CalendarHeader class="header">
                <DatePicker.CalendarPrevTrigger class="button">
                  &lsaquo;
                </DatePicker.CalendarPrevTrigger>
                <DatePicker.CalendarHeading class="heading" />
                <DatePicker.CalendarNextTrigger class="button">
                  &rsaquo;
                </DatePicker.CalendarNextTrigger>
              </DatePicker.CalendarHeader>
              <DatePicker.CalendarBody>
                <DatePicker.CalendarGrid class="grid">
                  <DatePicker.CalendarGridHeader>
                    <DatePicker.CalendarGridHeaderRow>
                      {weekDay => (
                        <DatePicker.CalendarGridHeaderCell>
                          {weekDay()}
                        </DatePicker.CalendarGridHeaderCell>
                      )}
                    </DatePicker.CalendarGridHeaderRow>
                  </DatePicker.CalendarGridHeader>
                  <DatePicker.CalendarGridBody>
                    {weekIndex => (
                      <DatePicker.CalendarGridBodyRow weekIndex={weekIndex()}>
                        {date => (
                          <Show when={date()} fallback={<td />}>
                            <DatePicker.CalendarGridBodyCell date={date()!}>
                              <DatePicker.CalendarGridBodyCellTrigger class="cell" />
                            </DatePicker.CalendarGridBodyCell>
                          </Show>
                        )}
                      </DatePicker.CalendarGridBodyRow>
                    )}
                  </DatePicker.CalendarGridBody>
                </DatePicker.CalendarGrid>
              </DatePicker.CalendarBody>
            </DatePicker.Calendar>
          </DatePicker.Content>
        </DatePicker.Portal>
      </DatePicker.Root>
    </>
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
