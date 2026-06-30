import preview from "../../../../../.storybook/preview.js";
import { Arrow, Content, Portal, Root, Trigger } from "../index";

const meta = preview.meta({
	title: "Components/HoverCard",
	tags: ["autodocs"],
});

export default meta;

const contentClass =
	"z-50 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-md font-sans";

const triggerClass =
	"text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded";

/** Opens when the cursor enters the link and closes after it leaves. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={triggerClass} href="#">
				Hover over me
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<div class="flex items-center gap-3 mb-2">
						<div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
							JD
						</div>
						<div>
							<p class="text-sm font-semibold text-slate-900">Jane Doe</p>
							<p class="text-xs text-slate-500">@janedoe</p>
						</div>
					</div>
					<p class="text-xs text-slate-600">
						Product designer &amp; open-source contributor. Building accessible
						UI.
					</p>
				</Content>
			</Portal>
		</Root>
	),
});

/** Arrow pointing toward the trigger element. */
export const WithArrow = meta.story({
	name: "With Arrow",
	render: () => (
		<Root>
			<Trigger class={triggerClass} href="#">
				With arrow
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Arrow class="fill-white [filter:drop-shadow(0_1px_0_rgb(226_232_240))]" />
					<p class="text-sm text-slate-700">
						The arrow connects the card visually to its trigger.
					</p>
				</Content>
			</Portal>
		</Root>
	),
});

/** Placement set to bottom. */
export const PlacementBottom = meta.story({
	name: "Placement Bottom",
	render: () => (
		<Root placement="bottom">
			<Trigger class={triggerClass} href="#">
				Open below
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Arrow class="fill-white [filter:drop-shadow(0_-1px_0_rgb(226_232_240))]" />
					<p class="text-sm text-slate-700">
						This hover card appears below the trigger.
					</p>
				</Content>
			</Portal>
		</Root>
	),
});

/** Shorter open / close delays (200 ms / 100 ms). */
export const FastDelays = meta.story({
	name: "Fast Delays",
	render: () => (
		<Root openDelay={200} closeDelay={100}>
			<Trigger class={triggerClass} href="#">
				Fast hover card
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<p class="text-sm text-slate-700">
						Opens in 200 ms, closes in 100 ms.
					</p>
				</Content>
			</Portal>
		</Root>
	),
});

/** `ignoreSafeArea` — card closes immediately when the cursor leaves the trigger. */
export const NoSafeArea = meta.story({
	name: "No Safe Area",
	render: () => (
		<Root ignoreSafeArea>
			<Trigger class={triggerClass} href="#">
				No safe area
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<p class="text-sm text-slate-700">
						No safe zone between trigger and card — closes as soon as the cursor
						leaves the trigger.
					</p>
				</Content>
			</Portal>
		</Root>
	),
});

/** Card with richer content: stats and action link. */
export const RichContent = meta.story({
	name: "Rich Content",
	render: () => (
		<Root>
			<Trigger class={triggerClass} href="#">
				@solidjs
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<div class="flex items-start justify-between mb-3">
						<div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
							S
						</div>
						<a
							href="#"
							class="text-xs font-medium text-blue-600 hover:underline focus-visible:outline-none"
						>
							Follow
						</a>
					</div>
					<p class="text-sm font-semibold text-slate-900">SolidJS</p>
					<p class="text-xs text-slate-500 mb-3">@solidjs</p>
					<p class="text-xs text-slate-600 mb-3">
						Simple and performant reactivity for building user interfaces.
					</p>
					<div class="flex gap-4 text-xs text-slate-500">
						<span>
							<strong class="text-slate-900">1.2k</strong> Following
						</span>
						<span>
							<strong class="text-slate-900">42k</strong> Followers
						</span>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});
