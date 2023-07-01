import {
  parseDate,
  today,
  createCalendar,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";
import { RangeValue } from "@kobalte/utils";
import { createSignal, For, Show } from "solid-js";

import { Calendar, createDateFormatter, DatePicker, I18nProvider } from "../src";

export default function App() {
  const [value, setValue] = createSignal<DateValue>();
  //const [value, setValue] = createSignal<DateValue[]>([]);
  //const [value, setValue] = createSignal<RangeValue<DateValue>>();

  return (
    <I18nProvider locale="fr-FR">
      <>
        <DatePicker.Root
          createCalendar={createCalendar}
          selectionMode="single"
          minValue={today(getLocalTimeZone())}
          defaultValue={parseDate("2022-02-03")}
          hourCycle={24}
          shouldForceLeadingZeros
          value={value()}
          onChange={setValue}
        >
          <DatePicker.Control class="control">
            <DatePicker.Input class="input">
              {segment => <DatePicker.Segment segment={segment} />}
            </DatePicker.Input>
            <DatePicker.Trigger>🗓</DatePicker.Trigger>
          </DatePicker.Control>
          <DatePicker.Portal>
            <DatePicker.Content class="content">
              <DatePicker.Arrow />
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
    </I18nProvider>
  );
}

/*

<Calendar.Root
  class="calendar"
  createCalendar={createCalendar}
  selectionMode="single"
  value={value()}
  onChange={setValue}
>
  <Calendar.Header class="header">
    <Calendar.PrevTrigger class="button">&lsaquo;</Calendar.PrevTrigger>
    <Calendar.Heading class="heading" />
    <Calendar.NextTrigger class="button">&rsaquo;</Calendar.NextTrigger>
  </Calendar.Header>
  <Calendar.Body>
    <Calendar.Grid class="grid">
      <Calendar.GridHeader>
        <Calendar.GridHeaderRow>
          {weekDay => <Calendar.GridHeaderCell>{weekDay()}</Calendar.GridHeaderCell>}
        </Calendar.GridHeaderRow>
      </Calendar.GridHeader>
      <Calendar.GridBody>
        {weekIndex => (
          <Calendar.GridBodyRow weekIndex={weekIndex()}>
            {date => (
              <Show when={date()} fallback={<td />}>
                <Calendar.GridBodyCell date={date()!}>
                  <Calendar.GridBodyCellTrigger class="cell" />
                </Calendar.GridBodyCell>
              </Show>
            )}
          </Calendar.GridBodyRow>
        )}
      </Calendar.GridBody>
    </Calendar.Grid>
  </Calendar.Body>
</Calendar.Root>

*/
