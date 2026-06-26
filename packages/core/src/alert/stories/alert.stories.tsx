import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";

const meta = preview.meta({
	title: "Components/Alert",
	tags: ["autodocs"],
});

export default meta;

const baseClass =
	"flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-sans w-80";

/** A plain alert with no decoration — role="alert" is always present. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={`${baseClass} border-slate-200 bg-slate-50 text-slate-800`}>
			Your session was saved successfully.
		</Root>
	),
});

/** Informational alert with a title and supporting text. */
export const WithTitle = meta.story({
	name: "With Title",
	render: () => (
		<Root class={`${baseClass} border-blue-200 bg-blue-50 text-blue-900`}>
			<div class="flex flex-col gap-0.5">
				<p class="font-semibold leading-tight">Update available</p>
				<p class="text-blue-700 text-xs leading-relaxed">
					A new version is ready. Refresh to apply changes.
				</p>
			</div>
		</Root>
	),
});

/** A success-state alert confirming a completed action. */
export const Success = meta.story({
	name: "Success",
	render: () => (
		<Root class={`${baseClass} border-green-200 bg-green-50 text-green-900`}>
			<span class="text-green-500 mt-0.5 shrink-0" aria-hidden="true">
				✓
			</span>
			<div class="flex flex-col gap-0.5">
				<p class="font-semibold leading-tight">Payment confirmed</p>
				<p class="text-green-700 text-xs">Your order has been placed.</p>
			</div>
		</Root>
	),
});

/** A warning-state alert surfacing a non-blocking concern. */
export const Warning = meta.story({
	name: "Warning",
	render: () => (
		<Root class={`${baseClass} border-yellow-200 bg-yellow-50 text-yellow-900`}>
			<span class="text-yellow-500 mt-0.5 shrink-0" aria-hidden="true">
				⚠
			</span>
			<div class="flex flex-col gap-0.5">
				<p class="font-semibold leading-tight">Storage nearly full</p>
				<p class="text-yellow-700 text-xs">You have used 90% of your quota.</p>
			</div>
		</Root>
	),
});

/** A destructive-state alert indicating an error or failure. */
export const Error = meta.story({
	name: "Error",
	render: () => (
		<Root class={`${baseClass} border-red-200 bg-red-50 text-red-900`}>
			<span class="text-red-500 mt-0.5 shrink-0" aria-hidden="true">
				✕
			</span>
			<div class="flex flex-col gap-0.5">
				<p class="font-semibold leading-tight">Upload failed</p>
				<p class="text-red-700 text-xs">
					The file could not be processed. Please try again.
				</p>
			</div>
		</Root>
	),
});

/** All four semantic variants side by side for quick comparison. */
export const AllVariants = meta.story({
	name: "All Variants",
	render: () => (
		<div class="flex flex-col gap-3">
			{(
				[
					{
						icon: "ℹ",
						title: "Info",
						body: "Your changes will take effect after the next sync.",
						ring: "border-blue-200 bg-blue-50 text-blue-900",
						icon_color: "text-blue-400",
					},
					{
						icon: "✓",
						title: "Success",
						body: "Deployment finished with no errors.",
						ring: "border-green-200 bg-green-50 text-green-900",
						icon_color: "text-green-500",
					},
					{
						icon: "⚠",
						title: "Warning",
						body: "This action cannot be undone.",
						ring: "border-yellow-200 bg-yellow-50 text-yellow-900",
						icon_color: "text-yellow-500",
					},
					{
						icon: "✕",
						title: "Error",
						body: "Connection timed out. Check your network.",
						ring: "border-red-200 bg-red-50 text-red-900",
						icon_color: "text-red-500",
					},
				] as const
			).map((v) => (
				<Root class={`${baseClass} ${v.ring}`}>
					<span class={`${v.icon_color} mt-0.5 shrink-0`} aria-hidden="true">
						{v.icon}
					</span>
					<div class="flex flex-col gap-0.5">
						<p class="font-semibold leading-tight">{v.title}</p>
						<p class="text-xs opacity-80">{v.body}</p>
					</div>
				</Root>
			))}
		</div>
	),
});
