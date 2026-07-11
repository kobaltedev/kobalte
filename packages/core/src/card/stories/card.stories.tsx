import preview from "../../../../../.storybook/preview.js";
import {
	Content,
	Description,
	Header,
	HeaderAction,
	Root,
	Title,
} from "../index";

const meta = preview.meta({
	title: "Components/Card",
	tags: ["autodocs"],
});

export default meta;

const cardClass =
	"rounded-xl border border-slate-200 bg-white shadow-sm font-sans w-72";

/** A basic card with a header (title + description) and content. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={`${cardClass} p-4`}>
			<Header class="mb-3">
				<Title class="text-sm font-semibold text-slate-800">Security</Title>
				<Description class="text-xs text-slate-500">
					Security insights and blocked logins
				</Description>
			</Header>
			<Content class="flex gap-6">
				<div>
					<div class="text-xs text-slate-500">Security insights</div>
					<div class="text-2xl font-semibold text-slate-900">40</div>
				</div>
				<div>
					<div class="text-xs text-slate-500">Logins blocked</div>
					<div class="text-2xl font-semibold text-slate-900">0</div>
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
		<Root class={`${cardClass} p-4`}>
			<Header class="grid grid-cols-[1fr_auto] items-start gap-2 mb-3">
				<div>
					<Title class="text-sm font-semibold text-slate-800">
						Workers and Pages
					</Title>
				</div>
				<HeaderAction>
					<button
						type="button"
						class="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
						aria-label="Add"
					>
						+
					</button>
				</HeaderAction>
			</Header>
			<Content class="text-sm text-slate-600">8 deployed services</Content>
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
		<Root role="region" class={`${cardClass} p-4`}>
			<Header class="mb-3">
				<Title class="text-sm font-semibold text-slate-800">
					Zero Trust security
				</Title>
			</Header>
			<Content class="text-sm text-slate-600">
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
		<Root class={`${cardClass} p-4`}>
			<Header class="mb-2">
				<Title class="text-sm font-semibold text-slate-800">Domains</Title>
			</Header>
			<Content>
				<ul class="m-0 list-none p-0">
					{rows.map((row, i) => (
						<li
							class={`flex items-center justify-between gap-3 py-2 text-sm ${
								i > 0 ? "border-t border-slate-100" : ""
							}`}
						>
							<span class="flex items-center gap-2 text-slate-700">
								<span aria-hidden="true">{row.icon}</span>
								{row.label}
							</span>
							<span class="text-slate-400">{row.meta}</span>
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
		<div class="grid grid-cols-3 grid-rows-2 gap-4 font-sans w-[46rem]">
			<Root class="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
				<Header class="mb-2">
					<Title class="text-sm font-semibold text-slate-800">Security</Title>
				</Header>
				<Content class="text-2xl font-semibold text-slate-900">40</Content>
			</Root>
			<Root class="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
				<Header class="mb-2">
					<Title class="text-sm font-semibold text-slate-800">
						Performance
					</Title>
				</Header>
				<Content class="text-2xl font-semibold text-slate-900">16.2%</Content>
			</Root>
			<Root class="row-span-2 rounded-xl border border-slate-200 bg-white shadow-sm p-4">
				<Header class="mb-2">
					<Title class="text-sm font-semibold text-slate-800">
						Zero Trust security
					</Title>
				</Header>
				<Content>
					<ul class="m-0 list-none p-0 text-sm text-slate-600">
						<li class="py-1">Used / total seats — 0/50</li>
						<li class="py-1">Access controls — 0</li>
						<li class="py-1">DNS policies — 0</li>
					</ul>
				</Content>
			</Root>
			<Root class="col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm p-4">
				<Header class="mb-2">
					<Title class="text-sm font-semibold text-slate-800">Audit logs</Title>
				</Header>
				<Content class="text-sm text-slate-600">
					Update project · Delete deployment · Delete deployment
				</Content>
			</Root>
		</div>
	),
});
