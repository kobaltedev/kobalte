import { Calendar, I18nProvider } from "../src";

export default function App() {
  return (
    <I18nProvider locale="en-US">
      <Calendar.Root>
        <header>
          <Calendar.PrevTrigger>Prev</Calendar.PrevTrigger>
          <span>[TODO]: title</span>
          <Calendar.NextTrigger>Next</Calendar.NextTrigger>
        </header>
        <Calendar.Grid>
          <Calendar.GridHeader>
            <Calendar.HeaderRow>
              {weekDay => <Calendar.HeaderCell>{weekDay}</Calendar.HeaderCell>}
            </Calendar.HeaderRow>
          </Calendar.GridHeader>
          <Calendar.GridBody>
            {weekIndex => (
              <Calendar.Row weekIndex={weekIndex}>
                {date => <td>{date?.toString()}</td>}
              </Calendar.Row>
            )}
          </Calendar.GridBody>
        </Calendar.Grid>
      </Calendar.Root>
    </I18nProvider>
  );
}
