import { getLocalTimeZone, startOfMonth, today } from "@internationalized/date";

import { Calendar, I18nProvider } from "../src";

export default function App() {
  return (
    <div class="app">
      <I18nProvider>
        <Calendar
          minValue={startOfMonth(today(getLocalTimeZone()))}
          visibleMonths={2}
          class="calendar"
        >
          <Calendar.Month>
            <Calendar.Header class="header">
              <Calendar.PrevPageButton class="button">&lsaquo;</Calendar.PrevPageButton>
              <Calendar.Title />
              <div />
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
          <Calendar.Month offset={1}>
            <Calendar.Header class="header">
              <div />
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
        </Calendar>
      </I18nProvider>
    </div>
  );
}
