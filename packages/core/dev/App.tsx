import { getLocalTimeZone, today } from "@internationalized/date";

import { Calendar, I18nProvider } from "../src";

export default function App() {
  return (
    <div class="app">
      <I18nProvider>
        <Calendar minValue={today(getLocalTimeZone())} class="calendar">
          {state => (
            <>
              <div class="header">
                <Calendar.PrevPageButton class="button">&lsaquo;</Calendar.PrevPageButton>
                <h2>Title</h2>
                <Calendar.NextPageButton class="button">&rsaquo;</Calendar.NextPageButton>
              </div>
              <div class="flex space-x-12">
                <Calendar.Grid cell-padding="0" class="grid">
                  <Calendar.GridHeader>
                    <Calendar.WeekDays>{day => <th>{day()}</th>}</Calendar.WeekDays>
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {weekIndex => (
                      <Calendar.GridRow weekIndex={weekIndex()}>
                        {date => (
                          <Calendar.GridCell date={date()}>
                            <Calendar.CellButton class="cell" />
                          </Calendar.GridCell>
                        )}
                      </Calendar.GridRow>
                    )}
                  </Calendar.GridBody>
                </Calendar.Grid>
                <Calendar.Grid
                  startDate={state.visibleRange().start.add({ months: 1 })}
                  cell-padding="0"
                  class="grid"
                >
                  <Calendar.GridHeader>
                    <Calendar.WeekDays>{day => <th>{day()}</th>}</Calendar.WeekDays>
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {weekIndex => (
                      <Calendar.GridRow weekIndex={weekIndex()}>
                        {date => (
                          <Calendar.GridCell date={date()}>
                            <Calendar.CellButton class="cell" />
                          </Calendar.GridCell>
                        )}
                      </Calendar.GridRow>
                    )}
                  </Calendar.GridBody>
                </Calendar.Grid>
              </div>
            </>
          )}
        </Calendar>
      </I18nProvider>
    </div>
  );
}
