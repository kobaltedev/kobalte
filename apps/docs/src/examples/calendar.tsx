import { GregorianCalendar, isWeekend } from "@internationalized/date";
import { createMemo, createSignal, Show } from "solid-js";

import { Calendar, type DateValue } from "@kobalte/core/calendar";
import { Popover } from "@kobalte/core/popover";
import style from "./calendar.module.css";

const createCalendar = () => new GregorianCalendar();

function CalendarGrid(props: { offset?: { months: number } }) {
	return (
		<Calendar.Grid class={style.calendar__grid} offset={props.offset}>
			<Calendar.GridHeader>
				<Calendar.GridHeaderRow>
					{(day) => (
						<Calendar.GridHeaderCell class={style.calendar__day_name}>
							{day().slice(0, 2)}
						</Calendar.GridHeaderCell>
					)}
				</Calendar.GridHeaderRow>
			</Calendar.GridHeader>
			<Calendar.GridBody>
				{(weekIndex) => (
					<Calendar.GridBodyRow weekIndex={weekIndex()}>
						{(date) => (
							<Show when={date()} fallback={<td />}>
								{(d) => (
									<Calendar.GridBodyCell date={d()}>
										<Calendar.GridBodyCellTrigger
											class={style.calendar__cell_trigger}
										/>
									</Calendar.GridBodyCell>
								)}
							</Show>
						)}
					</Calendar.GridBodyRow>
				)}
			</Calendar.GridBody>
		</Calendar.Grid>
	);
}

export function BasicExample() {
	return (
		<Calendar.Root
			createCalendar={createCalendar}
			selectionMode="single"
			class={style.calendar}
		>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger
					class={style.calendar__nav_button}
					aria-label="Previous month"
				>
					&#8249;
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger
					class={style.calendar__nav_button}
					aria-label="Next month"
				>
					&#8250;
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body class={style.calendar__body}>
				<CalendarGrid />
			</Calendar.Body>
		</Calendar.Root>
	);
}

export function MultipleExample() {
	return (
		<Calendar.Root
			createCalendar={createCalendar}
			selectionMode="multiple"
			class={style.calendar}
		>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger
					class={style.calendar__nav_button}
					aria-label="Previous month"
				>
					&#8249;
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger
					class={style.calendar__nav_button}
					aria-label="Next month"
				>
					&#8250;
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body class={style.calendar__body}>
				<CalendarGrid />
			</Calendar.Body>
		</Calendar.Root>
	);
}

export function RangeExample() {
	return (
		<Calendar.Root
			createCalendar={createCalendar}
			selectionMode="range"
			visibleDuration={{ months: 2 }}
			class={style.calendar}
		>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger
					class={style.calendar__nav_button}
					aria-label="Previous month"
				>
					&#8249;
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger
					class={style.calendar__nav_button}
					aria-label="Next month"
				>
					&#8250;
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body class={style.calendar__body}>
				<CalendarGrid />
				<CalendarGrid offset={{ months: 1 }} />
			</Calendar.Body>
		</Calendar.Root>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal<DateValue | null>(null);

	return (
		<div style={{ display: "flex", "flex-direction": "column", gap: "12px", "align-items": "flex-start" }}>
			<Calendar.Root
				createCalendar={createCalendar}
				selectionMode="single"
				value={value()}
				onChange={(v) => setValue(v as DateValue)}
				class={style.calendar}
			>
				<Calendar.Header class={style.calendar__header}>
					<Calendar.PrevTrigger
						class={style.calendar__nav_button}
						aria-label="Previous month"
					>
						&#8249;
					</Calendar.PrevTrigger>
					<Calendar.Heading class={style.calendar__heading} />
					<Calendar.NextTrigger
						class={style.calendar__nav_button}
						aria-label="Next month"
					>
						&#8250;
					</Calendar.NextTrigger>
				</Calendar.Header>
				<Calendar.Body class={style.calendar__body}>
					<CalendarGrid />
				</Calendar.Body>
			</Calendar.Root>
			<p class={style.calendar__controlled_output}>
				{value() ? `Selected: ${value()!.toString()}` : "No date selected"}
			</p>
		</div>
	);
}

export function DisabledDatesExample() {
	return (
		<Calendar.Root
			createCalendar={createCalendar}
			selectionMode="single"
			isDateUnavailable={(date) => isWeekend(date, "en-US")}
			class={style.calendar}
		>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger
					class={style.calendar__nav_button}
					aria-label="Previous month"
				>
					&#8249;
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger
					class={style.calendar__nav_button}
					aria-label="Next month"
				>
					&#8250;
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body class={style.calendar__body}>
				<CalendarGrid />
			</Calendar.Body>
		</Calendar.Root>
	);
}

function CalendarIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
			<line x1="16" y1="2" x2="16" y2="6" />
			<line x1="8" y1="2" x2="8" y2="6" />
			<line x1="3" y1="10" x2="21" y2="10" />
		</svg>
	);
}

export function DatePickerExample() {
	const [open, setOpen] = createSignal(false);
	const [value, setValue] = createSignal<DateValue | null>(null);

	const formatted = createMemo(() => {
		const v = value();
		if (!v) return "";
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return new Intl.DateTimeFormat("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		}).format(v.toDate(tz));
	});

	return (
		<Popover open={open()} onOpenChange={setOpen} placement="bottom-start" gutter={4}>
			<Popover.Anchor class={style.datepicker}>
				<input
					class={style.datepicker__input}
					readOnly
					value={formatted()}
					placeholder="Select a date…"
					aria-label="Selected date"
				/>
				<Popover.Trigger
					class={style.datepicker__button}
					aria-label="Open calendar"
				>
					<CalendarIcon />
				</Popover.Trigger>
			</Popover.Anchor>
			<Popover.Portal>
				<Popover.Content class={style.datepicker__popover}>
					<Calendar.Root
						createCalendar={createCalendar}
						selectionMode="single"
						value={value()}
						onChange={(v) => {
							setValue(v as DateValue);
							setOpen(false);
						}}
						class={style.calendar}
					>
						<Calendar.Header class={style.calendar__header}>
							<Calendar.PrevTrigger
								class={style.calendar__nav_button}
								aria-label="Previous month"
							>
								&#8249;
							</Calendar.PrevTrigger>
							<Calendar.Heading class={style.calendar__heading} />
							<Calendar.NextTrigger
								class={style.calendar__nav_button}
								aria-label="Next month"
							>
								&#8250;
							</Calendar.NextTrigger>
						</Calendar.Header>
						<Calendar.Body class={style.calendar__body}>
							<CalendarGrid />
						</Calendar.Body>
					</Calendar.Root>
				</Popover.Content>
			</Popover.Portal>
		</Popover>
	);
}
