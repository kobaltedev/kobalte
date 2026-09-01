import preview from "../../../../../.storybook/preview.js";
import {
	Content,
	Description,
	Header,
	HeaderAction,
	Root,
	Title,
} from "../index";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Card",
	tags: ["autodocs"],
});

export default meta;

/** A basic card with a header (title + description) and content. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={`${style.panel} ${style.panelNarrow}`}>
			<Header class={style.header}>
				<Title class={style.title}>Security</Title>
				<Description class={style.description}>
					Security insights and blocked logins
				</Description>
			</Header>
			<Content class={style.statsRow}>
				<div>
					<div class={style.description}>Security insights</div>
					<div class={style.statValue}>40</div>
				</div>
				<div>
					<div class={style.description}>Logins blocked</div>
					<div class={style.statValue}>0</div>
				</div>
			</Content>
		</Root>
	),
});

/**
 * `Card.HeaderAction` is a structural slot, not a styled component — the
 * two-column layout here (title/description on the left, action on the
 * right) is a plain CSS grid recipe, not something `Card` ships for you.
 */
export const WithHeaderAction = meta.story({
	name: "With Header Action",
	render: () => (
		<Root class={`${style.panel} ${style.panelNarrow}`}>
			<Header class={style.headerGrid}>
				<div>
					<Title class={style.title}>Workers and Pages</Title>
				</div>
				<HeaderAction>
					<button type="button" class={style.iconButton} aria-label="Add">
						+
					</button>
				</HeaderAction>
			</Header>
			<Content class={style.bodyText}>8 deployed services</Content>
		</Root>
	),
});

/**
 * `role` is not forced by `Card.Root` — a dashboard with many cards
 * defaulting to `role="region"` would clutter screen reader landmark
 * navigation. Pass `role="region"` explicitly when a card really is a
 * meaningful landmark (e.g. the single primary content area of a page).
 */
export const Region = meta.story({
	name: "Region",
	render: () => (
		<Root role="region" class={`${style.panel} ${style.panelNarrow}`}>
			<Header class={style.header}>
				<Title class={style.title}>Zero Trust security</Title>
			</Header>
			<Content class={style.bodyText}>
				This card is announced as a landmark region named "Zero Trust security"
				to screen reader users.
			</Content>
		</Root>
	),
});

const rows = [
	{ icon: "🌐", label: "solidjs.com", meta: "140K" },
	{ icon: "🌐", label: "solid-movies.app", meta: "39K" },
	{ icon: "🌐", label: "solidjs.community", meta: "10K" },
];

/**
 * Static resource rows (like the Domains/Workers list in a dashboard) use
 * plain `<ul>`/`<li>` inside `Card.Content` — not a dedicated `List`
 * component. Kobalte's `Listbox` forces `listbox`/`option` ARIA roles
 * meant for selectable widgets, which is the wrong semantics for a
 * read-only list of rows; native list semantics are already correct here.
 */
export const ListContent = meta.story({
	name: "List Content",
	render: () => (
		<Root class={`${style.panel} ${style.panelNarrow}`}>
			<Header class={style.headerCompact}>
				<Title class={style.title}>Domains</Title>
			</Header>
			<Content>
				<ul class={style.list}>
					{rows.map((row, i) => (
						<li
							class={`${style.listRow} ${i > 0 ? style.listRowBordered : ""}`}
						>
							<span class={style.listRowLabel}>
								<span aria-hidden="true">{row.icon}</span>
								{row.label}
							</span>
							<span class={style.listRowMeta}>{row.meta}</span>
						</li>
					))}
				</ul>
			</Content>
		</Root>
	),
});

/**
 * `Card` ships no layout primitive for arranging multiple cards — the
 * grid below (narrow cards on top, a taller card spanning two rows, wide
 * cards on the bottom) is a plain CSS grid recipe using `grid-column`/
 * `grid-row` spans, the same technique used to build bento-style
 * dashboards.
 */
export const DashboardGrid = meta.story({
	name: "Dashboard Grid",
	render: () => (
		<div class={style.dashboardGrid}>
			<Root class={style.panel}>
				<Header class={style.headerCompact}>
					<Title class={style.title}>Security</Title>
				</Header>
				<Content class={style.statValue}>40</Content>
			</Root>
			<Root class={style.panel}>
				<Header class={style.headerCompact}>
					<Title class={style.title}>Performance</Title>
				</Header>
				<Content class={style.statValue}>16.2%</Content>
			</Root>
			<Root class={`${style.panel} ${style.tallCard}`}>
				<Header class={style.headerCompact}>
					<Title class={style.title}>Zero Trust security</Title>
				</Header>
				<Content>
					<ul class={`${style.list} ${style.bodyText}`}>
						<li class={style.simpleListItem}>Used / total seats — 0/50</li>
						<li class={style.simpleListItem}>Access controls — 0</li>
						<li class={style.simpleListItem}>DNS policies — 0</li>
					</ul>
				</Content>
			</Root>
			<Root class={`${style.panel} ${style.wideCard}`}>
				<Header class={style.headerCompact}>
					<Title class={style.title}>Audit logs</Title>
				</Header>
				<Content class={style.bodyText}>
					Update project · Delete deployment · Delete deployment
				</Content>
			</Root>
		</div>
	),
});
