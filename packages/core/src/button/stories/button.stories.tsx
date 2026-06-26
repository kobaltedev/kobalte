import { createSignal, type ValidComponent } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Button } from "../index";

const meta = preview.meta({
	title: "Components/Button",
	tags: ["autodocs"],
});

export default meta;

function buttonClass(variant = "primary", size = "md") {
	const variants: Record<string, string> = {
		primary:
			"bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700",
		secondary: "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
		ghost:
			"bg-transparent text-slate-700 border-transparent hover:bg-slate-100",
		destructive:
			"bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700",
	};
	const sizes: Record<string, string> = {
		sm: "h-8 px-3 text-xs gap-1.5",
		md: "h-9 px-4 text-sm gap-2",
		lg: "h-11 px-6 text-base gap-2.5",
	};
	return [
		"inline-flex items-center justify-center font-medium font-sans rounded-md border transition-colors",
		"disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
		variants[variant] ?? variants.primary,
		sizes[size] ?? sizes.md,
	].join(" ");
}

/** Interactive playground — tweak every prop from the Controls panel. */
export const Playground = meta.story({
	name: "Playground",
	args: {
		label: "Click me",
		disabled: false,
		type: "button" as "button" | "submit" | "reset",
		variant: "primary" as string,
		size: "md" as string,
	},
	argTypes: {
		label: {
			control: "text",
			description: "Button text content (children)",
		},
		disabled: {
			control: "boolean",
			description:
				"Disables the button. Maps to native `disabled` for `<button>` and to `aria-disabled` + `data-disabled` for other elements.",
		},
		type: {
			control: "select",
			options: ["button", "submit", "reset"],
			description:
				"Native `type` attribute — only applied to `<button>` and `<input>` elements.",
		},
		variant: {
			control: "select",
			options: ["primary", "secondary", "ghost", "destructive"],
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
	},
	render: (args) => (
		<Button
			disabled={args.disabled}
			type={args.type}
			class={buttonClass(args.variant, args.size)}
		>
			{args.label}
		</Button>
	),
});

/** All four visual variants at a glance. Use the size control to resize them together. */
export const Variants = meta.story({
	name: "Variants",
	args: { size: "md" as string },
	argTypes: {
		size: { control: "select", options: ["sm", "md", "lg"] },
	},
	render: (args) => (
		<div class="flex flex-wrap items-center gap-3 font-sans">
			{(["primary", "secondary", "ghost", "destructive"] as const).map((v) => (
				<Button class={buttonClass(v, args.size)}>
					{v[0].toUpperCase() + v.slice(1)}
				</Button>
			))}
		</div>
	),
});

/** Three sizes for the primary variant. */
export const Sizes = meta.story({
	name: "Sizes",
	render: () => (
		<div class="flex flex-wrap items-center gap-3 font-sans">
			<Button class={buttonClass("primary", "sm")}>Small</Button>
			<Button class={buttonClass("primary", "md")}>Medium</Button>
			<Button class={buttonClass("primary", "lg")}>Large</Button>
		</div>
	),
});

/**
 * For a native `<button>`, `disabled` sets the HTML attribute and the browser blocks events.
 * For non-button elements (`<div>`, `<span>` …), `Button` switches to `aria-disabled` +
 * `data-disabled` so CSS can still style the state consistently.
 * Inspect the DOM to see the difference.
 */
export const DisabledState = meta.story({
	name: "Disabled State",
	render: () => (
		<div class="flex flex-col gap-5 font-sans text-sm">
			<div class="flex flex-wrap items-center gap-3">
				<Button class={buttonClass()}>Enabled</Button>
				<Button disabled class={buttonClass()}>
					Disabled
				</Button>
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<Button as="div" class={buttonClass("secondary")}>
					Enabled (div)
				</Button>
				<Button as="div" disabled class={buttonClass("secondary")}>
					Disabled (div)
				</Button>
			</div>
			<p class="text-xs text-slate-500 m-0">
				Top row: <code class="font-mono">&lt;button disabled&gt;</code>. Bottom
				row:{" "}
				<code class="font-mono">
					&lt;div aria-disabled="true" data-disabled=""&gt;
				</code>
				.
			</p>
		</div>
	),
});

/**
 * `Button` is polymorphic — swap the rendered element while keeping accessibility semantics.
 * Switch to `a` and it becomes an anchor; switch to `div` and `Button` adds `role="button"`.
 */
export const AsLink = meta.story({
	name: "As Link",
	args: { as: "a" as string },
	argTypes: {
		as: { control: "select", options: ["button", "a", "div", "span"] },
	},
	render: (args) => (
		<Button
			as={args.as as unknown as ValidComponent}
			href={args.as === "a" ? "https://kobalte.dev" : undefined}
			target={args.as === "a" ? "_blank" : undefined}
			rel={args.as === "a" ? "noopener noreferrer" : undefined}
			class={[buttonClass("secondary"), "no-underline"].join(" ")}
		>
			Kobalte docs
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="13"
				height="13"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
				<polyline points="15 3 21 3 21 9" />
				<line x1="10" y1="14" x2="21" y2="3" />
			</svg>
		</Button>
	),
});

/** Leading and trailing icon layouts for each variant. */
export const WithIcon = meta.story({
	name: "With Icon",
	render: () => (
		<div class="flex flex-wrap items-center gap-3 font-sans">
			<Button class={buttonClass()}>
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
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
				Continue
			</Button>
			<Button class={buttonClass("secondary")}>
				Download
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
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
				</svg>
			</Button>
			<Button class={buttonClass("ghost")}>
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
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				Info
			</Button>
			<Button class={buttonClass("destructive")}>
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
					<polyline points="3 6 5 6 21 6" />
					<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
					<path d="M10 11v6M14 11v6M9 6V4h6v2" />
				</svg>
				Delete
			</Button>
		</div>
	),
});

/**
 * Verifies that click events fire on any element type.
 * Switch `as` to `div` or `span` — the counter still increments because
 * `Button` synthesises keyboard + pointer handlers on non-native elements.
 */
export const ClickCounter = meta.story({
	name: "Click Counter",
	args: { as: "button" as string },
	argTypes: {
		as: { control: "select", options: ["button", "a", "div", "span"] },
	},
	render: (args) => {
		const [count, setCount] = createSignal(0);
		return (
			<div class="flex flex-col items-center gap-4 font-sans">
				<Button
					as={args.as as unknown as ValidComponent}
					class={buttonClass()}
					onClick={() => setCount((c) => c + 1)}
				>
					Clicked {count()} {count() === 1 ? "time" : "times"}
				</Button>
				<p class="text-xs text-slate-500 m-0">
					Rendered as{" "}
					<code class="font-mono text-blue-700">&lt;{args.as}&gt;</code>
				</p>
			</div>
		);
	},
});
