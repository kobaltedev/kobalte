import { ComponentProps, For } from "solid-js";

import { Calendar, I18nProvider } from "../src";

function CalendarMonth(props: ComponentProps<typeof Calendar.Month>) {
  return (
    <Calendar.Month {...props}>
      <Calendar.Header class="header">
        <Calendar.PrevPageButton class="button">&lsaquo;</Calendar.PrevPageButton>
        <Calendar.Title />
        <Calendar.NextPageButton class="button">&rsaquo;</Calendar.NextPageButton>
      </Calendar.Header>
      <Calendar.Grid cell-padding="0" class="grid">
        <Calendar.GridHeader>
          <Calendar.WeekDays class="week-days">
            {day => <Calendar.WeekDay>{day()}</Calendar.WeekDay>}
          </Calendar.WeekDays>
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {weekIndex => (
            <Calendar.Row weekIndex={weekIndex()}>
              {date => (
                <Calendar.Cell date={date()}>
                  <Calendar.Day class="cell" />
                </Calendar.Cell>
              )}
            </Calendar.Row>
          )}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar.Month>
  );
}

export default function App() {
  const months = [...new Array(2).keys()];

  return (
    <div class="app">
      <I18nProvider>
        <Calendar class="calendar" visibleMonths={months.length}>
          <For each={months}>{offset => <CalendarMonth offset={offset} />}</For>
        </Calendar>
      </I18nProvider>
    </div>
  );
}
