import { Calendar, I18nProvider } from "../src";

export default function App() {
  return (
    <div class="app">
      <I18nProvider>
        <Calendar.Range class="calendar">
          <Calendar.Month>
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
        </Calendar.Range>
      </I18nProvider>
    </div>
  );
}
