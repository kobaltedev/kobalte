import {
  CalendarNextTrigger as NextTrigger,
  type CalendarNextTriggerOptions,
  type CalendarNextTriggerProps,
} from "./calendar-next-trigger";
import {
  CalendarPrevTrigger as PrevTrigger,
  type CalendarPrevTriggerOptions,
  type CalendarPrevTriggerProps,
} from "./calendar-prev-trigger";
import { CalendarRoot as Root, type CalendarRootOptions, CalendarRootProps } from "./calendar-root";

export type {
  CalendarNextTriggerOptions,
  CalendarNextTriggerProps,
  CalendarPrevTriggerOptions,
  CalendarPrevTriggerProps,
  CalendarRootOptions,
  CalendarRootProps,
};

export { NextTrigger, PrevTrigger, Root };

/*

<Calendar.Root>
  <Calendar.View type="month">
    <Calendar.Header>
      <Calendar.PrevTrigger/>
      <Calendar.ViewTrigger/>
      <Calendar.NextTrigger/>
    </Calendar.Header>
    <Calendar.Grid>
      <Calendar.GridHeader>
        <Calendar.HeaderRow>
          <Calendar.HeaderCell/>
        </Calendar.HeaderRow>
      </Calendar.GridHeader>
      <Calendar.GridBody>
        <Calendar.Row>
          <Calendar.DayCell>
            <Calendar.DayCellTrigger/>
          </Calendar.DayCell>
        </Calendar.Row>
      </Calendar.GridBody>
    </Calendar.Grid>
  </Calendar.View>
  <Calendar.View type="year">
    <Calendar.Header>
      <Calendar.PrevTrigger/>
      <Calendar.ViewTrigger/>
      <Calendar.NextTrigger/>
    </Calendar.Header>
    <Calendar.Grid>
      <Calendar.GridBody>
        <Calendar.Row>
          <Calendar.MonthCell>
            <Calendar.MonthCellTrigger/>
          </Calendar.MonthCell>
        </Calendar.Row>
      </Calendar.GridBody>
    </Calendar.Grid>
  </Calendar.View>
  <Calendar.View type="decade">
    <Calendar.Header>
      <Calendar.PrevTrigger/>
      <Calendar.ViewTrigger/>
      <Calendar.NextTrigger/>
    </Calendar.Header>
    <Calendar.Grid>
      <Calendar.GridBody>
        <Calendar.Row>
          <Calendar.YearCell>
            <Calendar.YearCellTrigger/>
          </Calendar.YearCell>
        </Calendar.Row>
      </Calendar.GridBody>
    </Calendar.Grid>
  </Calendar.View>
</Calendar.Root>

*/
