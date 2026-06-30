/*
 * Calendar stories for Kobalte.
 *
 * Calendar logic ported from corvu/calendar (MIT) by Jasmin Noetzli:
 * https://github.com/corvudev/corvu/tree/main/packages/calendar
 */

import {
	CalendarDate,
	GregorianCalendar,
	isWeekend,
	today,
} from "@internationalized/date";
import { createMemo, createSignal, Show } from "solid-js";
// biome-ignore lint/style/useImportType: storybook meta helper
import preview from "../../../../../.storybook/preview";
import {
	Body,
	Grid,
	GridBody,
	GridBodyCell,
	GridBodyCellTrigger,
	GridBodyRow,
	GridHeader,
	GridHeaderCell,
	GridHeaderRow,
	Header,
	Heading,
	NextTrigger,
	PrevTrigger,
	Root,
} from "../index";
import { Popover } from "../../popover";
import type { DateValue } from "../types";
import type { RangeValue } from "@kobalte/utils";

const meta = preview.meta({
	title: "Components/Calendar",
	tags: ["autodocs"],
});

export default meta;
const createCalendar = () => new GregorianCalendar();
const rootStyle: Record<string, string> = {
	display: "inline-block",
	background: "#fff",
	border: "1px solid #e2e8f0",
	"border-radius": "10px",
	padding: "16px",
	"box-shadow": "0 1px 4px rgba(0,0,0,0.06)",
	"font-family": "sans-serif",
};

const headerStyle: Record<string, string> = {
	display: "flex",
	"align-items": "center",
	"justify-content": "space-between",
	"margin-bottom": "12px",
};

const headingStyle: Record<string, string> = {
	"font-size": "14px",
	"font-weight": "600",
	color: "#0f172a",
};

const navBtnStyle: Record<string, string> = {
	display: "inline-flex",
	"align-items": "center",
	"justify-content": "center",
	width: "28px",
	height: "28px",
	"border-radius": "6px",
	border: "1px solid #e2e8f0",
	background: "#fff",
	color: "#475569",
	cursor: "pointer",
	"font-size": "14px",
	"line-height": "1",
	"flex-shrink": "0",
};

const tableStyle: Record<string, string> = {
	"border-collapse": "collapse",
	width: "100%",
};

const dayNameStyle: Record<string, string> = {
	"font-size": "11px",
	"font-weight": "500",
	color: "#94a3b8",
	"text-align": "center",
	padding: "4px 0 8px",
	"text-transform": "uppercase",
	"letter-spacing": "0.03em",
};

// Cell trigger gets a class string; we rely on data attributes for state styling
const cellTriggerClass =
	"w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer select-none " +
	"text-slate-700 " +
	"data-[selected]:bg-blue-500 data-[selected]:text-white " +
	"data-[today]:font-semibold data-[today]:text-blue-600 " +
	"data-[today][data-selected]:text-white " +
	"data-[disabled]:opacity-30 data-[disabled]:cursor-default " +
	"data-[unavailable]:line-through data-[unavailable]:opacity-40 data-[unavailable]:cursor-default " +
	"data-[outside-month]:opacity-20 " +
	"hover:bg-slate-100 data-[selected]:hover:bg-blue-600 data-[disabled]:hover:bg-transparent " +
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1";

const rangeStartClass =
	"w-8 h-8 flex items-center justify-center text-sm cursor-pointer select-none " +
	"text-white bg-blue-500 rounded-full " +
	"data-[disabled]:opacity-30 data-[disabled]:cursor-default " +
	"hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1";
interface ShellProps {
	selectionMode?: "single" | "multiple" | "range";
	value?: DateValue | DateValue[] | RangeValue<DateValue> | null;
	defaultValue?: DateValue | DateValue[] | RangeValue<DateValue> | null;
	onChange?: (value: DateValue | DateValue[] | RangeValue<DateValue>) => void;
	isDateUnavailable?: (date: DateValue) => boolean;
	minValue?: DateValue;
	maxValue?: DateValue;
	disabled?: boolean;
	readOnly?: boolean;
	visibleDuration?: { months?: number; days?: number; weeks?: number; years?: number };
	/** Show two months side by side (for range picker). */
	twoMonths?: boolean;
}

function CalendarShell(props: ShellProps) {
	const { twoMonths: _twoMonths, ...rest } = props;
	const twoMonths = _twoMonths;

	return (
		<Root createCalendar={createCalendar} style={rootStyle} {...(rest as any)}>
			<Header style={headerStyle}>
				<PrevTrigger style={navBtnStyle} aria-label="Previous month">
					&#8249;
				</PrevTrigger>
				<Heading style={headingStyle} />
				<NextTrigger style={navBtnStyle} aria-label="Next month">
					&#8250;
				</NextTrigger>
			</Header>
			<Body
				style={{
					display: "flex",
					gap: "24px",
				}}
			>
				<Grid style={tableStyle}>
					<GridHeader>
						<GridHeaderRow>
							{(day) => (
								<GridHeaderCell style={dayNameStyle}>
									{day().slice(0, 2)}
								</GridHeaderCell>
							)}
						</GridHeaderRow>
					</GridHeader>
					<GridBody>
						{(weekIndex) => (
							<GridBodyRow weekIndex={weekIndex()}>
								{(date) => (
									<Show when={date()} fallback={<td />}>
										{(d) => (
											<GridBodyCell date={d()}>
												<GridBodyCellTrigger class={cellTriggerClass} />
											</GridBodyCell>
										)}
									</Show>
								)}
							</GridBodyRow>
						)}
					</GridBody>
				</Grid>
				<Show when={twoMonths}>
					<Grid style={tableStyle} offset={{ months: 1 }}>
						<GridHeader>
							<GridHeaderRow>
								{(day) => (
									<GridHeaderCell style={dayNameStyle}>
										{day().slice(0, 2)}
									</GridHeaderCell>
								)}
							</GridHeaderRow>
						</GridHeader>
						<GridBody>
							{(weekIndex) => (
								<GridBodyRow weekIndex={weekIndex()}>
									{(date) => (
										<Show when={date()} fallback={<td />}>
											{(d) => (
												<GridBodyCell date={d()}>
													<GridBodyCellTrigger class={cellTriggerClass} />
												</GridBodyCell>
											)}
										</Show>
									)}
								</GridBodyRow>
							)}
						</GridBody>
					</Grid>
				</Show>
			</Body>
		</Root>
	);
}
/** Select a single date. Click a day to select it; click again to keep it selected. */
export const Single = meta.story({
	name: "Single",
	render: () => <CalendarShell selectionMode="single" />,
});

/** Select multiple non-contiguous dates by clicking each one. Click a selected date to deselect it. */
export const Multiple = meta.story({
	name: "Multiple",
	render: () => <CalendarShell selectionMode="multiple" />,
});

/** Select a date range by clicking a start date, then an end date. Two months are shown for easier cross-month selection. */
export const Range = meta.story({
	name: "Range",
	render: () => (
		<CalendarShell
			selectionMode="range"
			visibleDuration={{ months: 2 }}
			twoMonths
		/>
	),
});

/** Controlled single-selection with the selected date displayed below. */
function ControlledDemo() {
	const [value, setValue] = createSignal<DateValue | null>(null);

	return (
		<div style={{ display: "flex", "flex-direction": "column", gap: "12px", "align-items": "flex-start" }}>
			<CalendarShell
				selectionMode="single"
				value={value()}
				onChange={(v) => setValue(v as unknown as DateValue)}
			/>
			<p
				style={{
					"font-size": "12px",
					color: "#64748b",
					"font-family": "sans-serif",
					margin: "0",
				}}
			>
				{value()
					? `Selected: ${value()!.toString()}`
					: "No date selected"}
			</p>
		</div>
	);
}

/** Controlled value — the selected date is stored externally and shown beneath the calendar. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Weekend days are marked unavailable. Clicking or navigating to them has no effect. */
export const DisabledDates = meta.story({
	name: "Disabled Dates (Weekends)",
	render: () => (
		<CalendarShell
			selectionMode="single"
			isDateUnavailable={(date) => isWeekend(date, "en-US")}
		/>
	),
});

/** Selection is constrained between two dates. Dates outside the range are disabled. */
function MinMaxDemo() {
	const tz = "UTC";
	const base = today(tz);
	const min = new CalendarDate(base.year, base.month, 1);
	const max = new CalendarDate(base.year, base.month, 15);

	return (
		<div style={{ display: "flex", "flex-direction": "column", gap: "8px", "align-items": "flex-start" }}>
			<p style={{ "font-size": "12px", color: "#64748b", "font-family": "sans-serif", margin: "0" }}>
				Only the 1st – 15th of this month are selectable.
			</p>
			<CalendarShell
				selectionMode="single"
				minValue={min}
				maxValue={max}
			/>
		</div>
	);
}

/** `minValue` and `maxValue` cap the selectable range to the first half of the current month. */
export const MinMax = meta.story({
	name: "Min / Max Dates",
	render: () => <MinMaxDemo />,
});

/** The entire calendar is read-only — selection state is shown but cannot be changed. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<CalendarShell
			selectionMode="single"
			defaultValue={new CalendarDate(2025, 6, 15)}
			readOnly
		/>
	),
});

/** A disabled calendar renders its dates but blocks all interaction. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<CalendarShell
			selectionMode="single"
			disabled
		/>
	),
});

function CalendarSVGIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="15"
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

function DatePickerDemo() {
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

	const inputStyle: Record<string, string> = {
		flex: "1",
		border: "none",
		outline: "none",
		padding: "0 10px",
		height: "38px",
		"font-size": "14px",
		"font-family": "sans-serif",
		color: "#0f172a",
		background: "transparent",
		cursor: "default",
		"min-width": "180px",
	};

	const iconBtnStyle: Record<string, string> = {
		display: "inline-flex",
		"align-items": "center",
		"justify-content": "center",
		width: "36px",
		height: "38px",
		border: "none",
		"border-left": "1px solid #e2e8f0",
		background: "white",
		color: "#64748b",
		cursor: "pointer",
		"flex-shrink": "0",
	};

	const anchorStyle: Record<string, string> = {
		display: "inline-flex",
		"align-items": "center",
		border: "1px solid #e2e8f0",
		"border-radius": "8px",
		background: "white",
		overflow: "hidden",
		"box-shadow": "0 1px 2px rgba(0,0,0,0.05)",
	};

	const popoverContentStyle: Record<string, string> = {
		"z-index": "50",
		outline: "none",
	};

	return (
		<Popover open={open()} onOpenChange={setOpen} placement="bottom-start" gutter={4}>
			<Popover.Anchor style={anchorStyle}>
				<input
					style={inputStyle}
					readonly
					value={formatted()}
					placeholder="Select a date…"
					aria-label="Selected date"
				/>
				<Popover.Trigger style={iconBtnStyle} aria-label="Open calendar">
					<CalendarSVGIcon />
				</Popover.Trigger>
			</Popover.Anchor>
			<Popover.Portal>
				<Popover.Content style={popoverContentStyle}>
					<Root
						createCalendar={createCalendar}
						selectionMode="single"
						value={value()}
						onChange={(v) => {
							setValue(v as DateValue);
							setOpen(false);
						}}
						style={rootStyle}
					>
						<Header style={headerStyle}>
							<PrevTrigger style={navBtnStyle} aria-label="Previous month">
								&#8249;
							</PrevTrigger>
							<Heading style={headingStyle} />
							<NextTrigger style={navBtnStyle} aria-label="Next month">
								&#8250;
							</NextTrigger>
						</Header>
						<Body>
							<Grid style={tableStyle}>
								<GridHeader>
									<GridHeaderRow>
										{(day) => (
											<GridHeaderCell style={dayNameStyle}>
												{day().slice(0, 2)}
											</GridHeaderCell>
										)}
									</GridHeaderRow>
								</GridHeader>
								<GridBody>
									{(weekIndex) => (
										<GridBodyRow weekIndex={weekIndex()}>
											{(date) => (
												<Show when={date()} fallback={<td />}>
													{(d) => (
														<GridBodyCell date={d()}>
															<GridBodyCellTrigger class={cellTriggerClass} />
														</GridBodyCell>
													)}
												</Show>
											)}
										</GridBodyRow>
									)}
								</GridBody>
							</Grid>
						</Body>
					</Root>
				</Popover.Content>
			</Popover.Portal>
		</Popover>
	);
}

/** An input that displays the selected date with a button to open a calendar picker. */
export const DatePicker = meta.story({
	name: "Date Picker",
	render: () => <DatePickerDemo />,
});

function DateRangePickerDemo() {
	const [open, setOpen] = createSignal(false);
	const [value, setValue] = createSignal<RangeValue<DateValue> | null>(null);

	const formatDate = (date: DateValue | undefined) => {
		if (!date) return "";
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date.toDate(tz));
	};

	const anchorStyle: Record<string, string> = {
		display: "inline-flex",
		"align-items": "center",
		border: "1px solid #e2e8f0",
		"border-radius": "8px",
		background: "white",
		overflow: "hidden",
		"box-shadow": "0 1px 2px rgba(0,0,0,0.05)",
	};

	const inputStyle: Record<string, string> = {
		border: "none",
		outline: "none",
		padding: "0 10px",
		height: "38px",
		"font-size": "14px",
		"font-family": "sans-serif",
		color: "#0f172a",
		background: "transparent",
		cursor: "default",
		width: "130px",
	};

	const dividerStyle: Record<string, string> = {
		color: "#94a3b8",
		"font-size": "14px",
		"font-family": "sans-serif",
		"flex-shrink": "0",
		"user-select": "none",
	};

	const iconBtnStyle: Record<string, string> = {
		display: "inline-flex",
		"align-items": "center",
		"justify-content": "center",
		width: "36px",
		height: "38px",
		border: "none",
		"border-left": "1px solid #e2e8f0",
		background: "white",
		color: "#64748b",
		cursor: "pointer",
		"flex-shrink": "0",
	};

	const twoMonthRootStyle: Record<string, string> = {
		...rootStyle,
		display: "inline-block",
	};

	const twoGridsStyle: Record<string, string> = {
		display: "flex",
		gap: "24px",
	};

	return (
		<Popover open={open()} onOpenChange={setOpen} placement="bottom-start" gutter={4}>
			<Popover.Anchor style={anchorStyle}>
				<input
					style={inputStyle}
					readonly
					value={formatDate(value()?.start)}
					placeholder="Start date"
					aria-label="Range start date"
				/>
				<span style={dividerStyle}>→</span>
				<input
					style={inputStyle}
					readonly
					value={formatDate(value()?.end)}
					placeholder="End date"
					aria-label="Range end date"
				/>
				<Popover.Trigger style={iconBtnStyle} aria-label="Open calendar">
					<CalendarSVGIcon />
				</Popover.Trigger>
			</Popover.Anchor>
			<Popover.Portal>
				<Popover.Content style={{ "z-index": "50", outline: "none" }}>
					<Root
						createCalendar={createCalendar}
						selectionMode="range"
						visibleDuration={{ months: 2 }}
						value={value()}
						onChange={(v) => {
							const range = v as RangeValue<DateValue>;
							setValue(range);
							setOpen(false);
						}}
						style={twoMonthRootStyle}
					>
						<Header style={headerStyle}>
							<PrevTrigger style={navBtnStyle} aria-label="Previous month">
								&#8249;
							</PrevTrigger>
							<Heading style={headingStyle} />
							<NextTrigger style={navBtnStyle} aria-label="Next month">
								&#8250;
							</NextTrigger>
						</Header>
						<Body style={twoGridsStyle}>
							<Grid style={tableStyle}>
								<GridHeader>
									<GridHeaderRow>
										{(day) => (
											<GridHeaderCell style={dayNameStyle}>
												{day().slice(0, 2)}
											</GridHeaderCell>
										)}
									</GridHeaderRow>
								</GridHeader>
								<GridBody>
									{(weekIndex) => (
										<GridBodyRow weekIndex={weekIndex()}>
											{(date) => (
												<Show when={date()} fallback={<td />}>
													{(d) => (
														<GridBodyCell date={d()}>
															<GridBodyCellTrigger class={cellTriggerClass} />
														</GridBodyCell>
													)}
												</Show>
											)}
										</GridBodyRow>
									)}
								</GridBody>
							</Grid>
							<Grid style={tableStyle} offset={{ months: 1 }}>
								<GridHeader>
									<GridHeaderRow>
										{(day) => (
											<GridHeaderCell style={dayNameStyle}>
												{day().slice(0, 2)}
											</GridHeaderCell>
										)}
									</GridHeaderRow>
								</GridHeader>
								<GridBody>
									{(weekIndex) => (
										<GridBodyRow weekIndex={weekIndex()}>
											{(date) => (
												<Show when={date()} fallback={<td />}>
													{(d) => (
														<GridBodyCell date={d()}>
															<GridBodyCellTrigger class={cellTriggerClass} />
														</GridBodyCell>
													)}
												</Show>
											)}
										</GridBodyRow>
									)}
								</GridBody>
							</Grid>
						</Body>
					</Root>
				</Popover.Content>
			</Popover.Portal>
		</Popover>
	);
}

/** Two inputs (start / end) with a button that opens a two-month range calendar. Selecting the end date closes the picker. */
export const DateRangePicker = meta.story({
	name: "Date Range Picker",
	render: () => <DateRangePickerDemo />,
});
