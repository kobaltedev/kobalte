import { Calendar, type DateValue } from "@kobalte/core/calendar";
import { createSignal, Show } from "solid-js";
import style from "./calendar.module.css";

export function BasicExample() {
	return (
		<Calendar selectionMode="single" class={style.calendar}>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger class={style.calendar__trigger}>
					{"<"}
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger class={style.calendar__trigger}>
					{">"}
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body>
				<Calendar.Grid class={style.calendar__grid}>
					<Calendar.GridHeader>
						<Calendar.GridHeaderRow>
							{(weekDay) => (
								<Calendar.GridHeaderCell
									class={style["calendar__grid-header-cell"]}
								>
									{weekDay()}
								</Calendar.GridHeaderCell>
							)}
						</Calendar.GridHeaderRow>
					</Calendar.GridHeader>
					<Calendar.GridBody>
						{(weekIndex) => (
							<Calendar.GridBodyRow weekIndex={weekIndex()}>
								{(date) => (
									<Show
										when={date()}
										fallback={<td class={style["calendar__grid-body-cell"]} />}
									>
										<Calendar.GridBodyCell
											date={date()!}
											class={style["calendar__grid-body-cell"]}
										>
											<Calendar.GridBodyCellTrigger
												class={style["calendar__grid-body-cell-trigger"]}
											/>
										</Calendar.GridBodyCell>
									</Show>
								)}
							</Calendar.GridBodyRow>
						)}
					</Calendar.GridBody>
				</Calendar.Grid>
			</Calendar.Body>
		</Calendar>
	);
}

export function MultipleExample() {
	return (
		<Calendar selectionMode="multiple" class={style.calendar}>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger class={style.calendar__trigger}>
					{"<"}
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger class={style.calendar__trigger}>
					{">"}
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body>
				<Calendar.Grid class={style.calendar__grid}>
					<Calendar.GridHeader>
						<Calendar.GridHeaderRow>
							{(weekDay) => (
								<Calendar.GridHeaderCell
									class={style["calendar__grid-header-cell"]}
								>
									{weekDay()}
								</Calendar.GridHeaderCell>
							)}
						</Calendar.GridHeaderRow>
					</Calendar.GridHeader>
					<Calendar.GridBody>
						{(weekIndex) => (
							<Calendar.GridBodyRow weekIndex={weekIndex()}>
								{(date) => (
									<Show
										when={date()}
										fallback={<td class={style["calendar__grid-body-cell"]} />}
									>
										<Calendar.GridBodyCell
											date={date()!}
											class={style["calendar__grid-body-cell"]}
										>
											<Calendar.GridBodyCellTrigger
												class={style["calendar__grid-body-cell-trigger"]}
											/>
										</Calendar.GridBodyCell>
									</Show>
								)}
							</Calendar.GridBodyRow>
						)}
					</Calendar.GridBody>
				</Calendar.Grid>
			</Calendar.Body>
		</Calendar>
	);
}

export function RangeExample() {
	return (
		<Calendar selectionMode="range" class={style.calendar}>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger class={style.calendar__trigger}>
					{"<"}
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger class={style.calendar__trigger}>
					{">"}
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body>
				<Calendar.Grid class={style.calendar__grid}>
					<Calendar.GridHeader>
						<Calendar.GridHeaderRow>
							{(weekDay) => (
								<Calendar.GridHeaderCell
									class={style["calendar__grid-header-cell"]}
								>
									{weekDay()}
								</Calendar.GridHeaderCell>
							)}
						</Calendar.GridHeaderRow>
					</Calendar.GridHeader>
					<Calendar.GridBody>
						{(weekIndex) => (
							<Calendar.GridBodyRow weekIndex={weekIndex()}>
								{(date) => (
									<Show
										when={date()}
										fallback={<td class={style["calendar__grid-body-cell"]} />}
									>
										<Calendar.GridBodyCell
											date={date()!}
											class={style["calendar__grid-body-cell"]}
										>
											<Calendar.GridBodyCellTrigger
												class={style["calendar__grid-body-cell-trigger"]}
											/>
										</Calendar.GridBodyCell>
									</Show>
								)}
							</Calendar.GridBodyRow>
						)}
					</Calendar.GridBody>
				</Calendar.Grid>
			</Calendar.Body>
		</Calendar>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal<DateValue | null>(
		new Date(2024, 0, 15),
	);

	return (
		<>
			<Calendar
				selectionMode="single"
				class={style.calendar}
				value={value()}
				onChange={setValue}
			>
				<Calendar.Header class={style.calendar__header}>
					<Calendar.PrevTrigger class={style.calendar__trigger}>
						{"<"}
					</Calendar.PrevTrigger>
					<Calendar.Heading class={style.calendar__heading} />
					<Calendar.NextTrigger class={style.calendar__trigger}>
						{">"}
					</Calendar.NextTrigger>
				</Calendar.Header>
				<Calendar.Body>
					<Calendar.Grid class={style.calendar__grid}>
						<Calendar.GridHeader>
							<Calendar.GridHeaderRow>
								{(weekDay) => (
									<Calendar.GridHeaderCell
										class={style["calendar__grid-header-cell"]}
									>
										{weekDay()}
									</Calendar.GridHeaderCell>
								)}
							</Calendar.GridHeaderRow>
						</Calendar.GridHeader>
						<Calendar.GridBody>
							{(weekIndex) => (
								<Calendar.GridBodyRow weekIndex={weekIndex()}>
									{(date) => (
										<Show
											when={date()}
											fallback={
												<td class={style["calendar__grid-body-cell"]} />
											}
										>
											<Calendar.GridBodyCell
												date={date()!}
												class={style["calendar__grid-body-cell"]}
											>
												<Calendar.GridBodyCellTrigger
													class={style["calendar__grid-body-cell-trigger"]}
												/>
											</Calendar.GridBodyCell>
										</Show>
									)}
								</Calendar.GridBodyRow>
							)}
						</Calendar.GridBody>
					</Calendar.Grid>
				</Calendar.Body>
			</Calendar>
			<p style={{ "font-size": "14px", "margin-top": "16px" }}>
				Selected date:{" "}
				<Show when={value()} fallback={"--"}>
					{value()!.toLocaleDateString()}
				</Show>
			</p>
		</>
	);
}

export function MinMaxExample() {
	return (
		<Calendar
			selectionMode="single"
			class={style.calendar}
			defaultFocusedValue={new Date(2024, 0, 15)}
			minValue={new Date(2024, 0, 5)}
			maxValue={new Date(2024, 0, 25)}
		>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger class={style.calendar__trigger}>
					{"<"}
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger class={style.calendar__trigger}>
					{">"}
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body>
				<Calendar.Grid class={style.calendar__grid}>
					<Calendar.GridHeader>
						<Calendar.GridHeaderRow>
							{(weekDay) => (
								<Calendar.GridHeaderCell
									class={style["calendar__grid-header-cell"]}
								>
									{weekDay()}
								</Calendar.GridHeaderCell>
							)}
						</Calendar.GridHeaderRow>
					</Calendar.GridHeader>
					<Calendar.GridBody>
						{(weekIndex) => (
							<Calendar.GridBodyRow weekIndex={weekIndex()}>
								{(date) => (
									<Show
										when={date()}
										fallback={<td class={style["calendar__grid-body-cell"]} />}
									>
										<Calendar.GridBodyCell
											date={date()!}
											class={style["calendar__grid-body-cell"]}
										>
											<Calendar.GridBodyCellTrigger
												class={style["calendar__grid-body-cell-trigger"]}
											/>
										</Calendar.GridBodyCell>
									</Show>
								)}
							</Calendar.GridBodyRow>
						)}
					</Calendar.GridBody>
				</Calendar.Grid>
			</Calendar.Body>
		</Calendar>
	);
}

export function DisabledExample() {
	return (
		<Calendar selectionMode="single" class={style.calendar} disabled>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger class={style.calendar__trigger}>
					{"<"}
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger class={style.calendar__trigger}>
					{">"}
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body>
				<Calendar.Grid class={style.calendar__grid}>
					<Calendar.GridHeader>
						<Calendar.GridHeaderRow>
							{(weekDay) => (
								<Calendar.GridHeaderCell
									class={style["calendar__grid-header-cell"]}
								>
									{weekDay()}
								</Calendar.GridHeaderCell>
							)}
						</Calendar.GridHeaderRow>
					</Calendar.GridHeader>
					<Calendar.GridBody>
						{(weekIndex) => (
							<Calendar.GridBodyRow weekIndex={weekIndex()}>
								{(date) => (
									<Show
										when={date()}
										fallback={<td class={style["calendar__grid-body-cell"]} />}
									>
										<Calendar.GridBodyCell
											date={date()!}
											class={style["calendar__grid-body-cell"]}
										>
											<Calendar.GridBodyCellTrigger
												class={style["calendar__grid-body-cell-trigger"]}
											/>
										</Calendar.GridBodyCell>
									</Show>
								)}
							</Calendar.GridBodyRow>
						)}
					</Calendar.GridBody>
				</Calendar.Grid>
			</Calendar.Body>
		</Calendar>
	);
}

export function UnavailableDatesExample() {
	const isDateUnavailable = (date: Date) => {
		return date.getDate() % 7 === 0;
	};

	return (
		<Calendar
			selectionMode="single"
			class={style.calendar}
			isDateUnavailable={isDateUnavailable}
		>
			<Calendar.Header class={style.calendar__header}>
				<Calendar.PrevTrigger class={style.calendar__trigger}>
					{"<"}
				</Calendar.PrevTrigger>
				<Calendar.Heading class={style.calendar__heading} />
				<Calendar.NextTrigger class={style.calendar__trigger}>
					{">"}
				</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body>
				<Calendar.Grid class={style.calendar__grid}>
					<Calendar.GridHeader>
						<Calendar.GridHeaderRow>
							{(weekDay) => (
								<Calendar.GridHeaderCell
									class={style["calendar__grid-header-cell"]}
								>
									{weekDay()}
								</Calendar.GridHeaderCell>
							)}
						</Calendar.GridHeaderRow>
					</Calendar.GridHeader>
					<Calendar.GridBody>
						{(weekIndex) => (
							<Calendar.GridBodyRow weekIndex={weekIndex()}>
								{(date) => (
									<Show
										when={date()}
										fallback={<td class={style["calendar__grid-body-cell"]} />}
									>
										<Calendar.GridBodyCell
											date={date()!}
											class={style["calendar__grid-body-cell"]}
										>
											<Calendar.GridBodyCellTrigger
												class={style["calendar__grid-body-cell-trigger"]}
											/>
										</Calendar.GridBodyCell>
									</Show>
								)}
							</Calendar.GridBodyRow>
						)}
					</Calendar.GridBody>
				</Calendar.Grid>
			</Calendar.Body>
		</Calendar>
	);
}
