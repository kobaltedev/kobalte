import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";

const meta = preview.meta({
	title: "Components/Skeleton",
	tags: ["autodocs"],
});

export default meta;

const baseClass = "bg-slate-200 animate-pulse rounded";

/** A full-width bar — the most common loading placeholder. */
export const Default = meta.story({
	name: "Default",
	render: () => <Root class={baseClass} height={16} />,
});

/** `circle` makes the skeleton round — great for avatars. */
export const Circle = meta.story({
	name: "Circle",
	render: () => <Root class={baseClass} height={48} circle />,
});

/** Explicit `width` and `height` to match a specific element. */
export const WithDimensions = meta.story({
	name: "With Dimensions",
	render: () => <Root class={baseClass} width={200} height={24} />,
});

/** `radius` rounds the corners to a fixed pixel value. */
export const WithRadius = meta.story({
	name: "With Radius",
	render: () => <Root class={baseClass} width={200} height={40} radius={8} />,
});

/** `visible={false}` renders children instead of the skeleton. */
export const NotVisible = meta.story({
	name: "Not Visible",
	render: () => (
		<Root class={baseClass} height={24} visible={false}>
			<p class="text-sm font-sans text-slate-700 px-2">Content loaded!</p>
		</Root>
	),
});

/** `animate={false}` disables the pulse animation. */
export const NotAnimated = meta.story({
	name: "Not Animated",
	render: () => (
		<Root class="bg-slate-200 rounded" height={16} animate={false} />
	),
});

/** A typical card loading state composed of multiple skeletons. */
export const CardLoading = meta.story({
	name: "Card Loading",
	render: () => (
		<div class="flex gap-3 w-72 p-4 rounded-xl border border-slate-100 shadow-sm font-sans">
			<Root class={baseClass} height={48} circle />
			<div class="flex flex-col gap-2 flex-1 justify-center">
				<Root class={baseClass} height={14} />
				<Root class={baseClass} height={10} width={120} />
			</div>
		</div>
	),
});

/** A feed-style list of skeleton rows. */
export const ListLoading = meta.story({
	name: "List Loading",
	render: () => (
		<div class="flex flex-col gap-4 w-72 font-sans">
			{([1, 2, 3] as const).map(() => (
				<div class="flex gap-3 items-start">
					<Root class={baseClass} height={36} circle />
					<div class="flex flex-col gap-2 flex-1">
						<Root class={baseClass} height={12} />
						<Root class={baseClass} height={10} width={180} />
						<Root class={baseClass} height={10} width={100} />
					</div>
				</div>
			))}
		</div>
	),
});
