import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";

const meta = preview.meta({
	title: "Primitives/SpinButton",
	tags: ["autodocs"],
});

export default meta;

/**
 * SpinButton is the low-level primitive used by NumberField and TimeField.
 * It handles keyboard navigation (Arrow Up/Down, Page Up/Down, Home/End),
 * ARIA spinbutton role, and live-region announcements.
 * Use NumberField or TimeField for most cases.
 */

function Counter() {
	const [count, setCount] = createSignal(0);
	const MIN = 0;
	const MAX = 10;

	return (
		<Root
			class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
			value={count()}
			textValue={String(count())}
			minValue={MIN}
			maxValue={MAX}
			onIncrement={() => setCount((c) => Math.min(c + 1, MAX))}
			onDecrement={() => setCount((c) => Math.max(c - 1, MIN))}
			onIncrementPage={() => setCount((c) => Math.min(c + 5, MAX))}
			onDecrementPage={() => setCount((c) => Math.max(c - 5, MIN))}
			onIncrementToMax={() => setCount(MAX)}
			onDecrementToMin={() => setCount(MIN)}
		>
			<button
				type="button"
				class="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40"
				onClick={() => setCount((c) => Math.max(c - 1, MIN))}
				disabled={count() <= MIN}
				tabindex="-1"
				aria-label="Decrement"
			>
				−
			</button>
			<span class="w-6 text-center text-sm font-medium text-slate-900 select-none">
				{count()}
			</span>
			<button
				type="button"
				class="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40"
				onClick={() => setCount((c) => Math.min(c + 1, MAX))}
				disabled={count() >= MAX}
				tabindex="-1"
				aria-label="Increment"
			>
				+
			</button>
		</Root>
	);
}

/** Focus the widget and use Arrow Up/Down (step ±1), Page Up/Down (step ±5), Home/End (min/max). */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<div class="flex flex-col gap-2 font-sans">
			<label class="text-sm font-medium text-slate-700" id="counter-label">
				Counter (0–10)
			</label>
			<Counter />
			<p class="text-xs text-slate-500">
				Click to focus, then use keyboard: ↑↓ step by 1, PgUp/PgDn step by 5, Home/End jump to min/max.
			</p>
		</div>
	),
});

function RatingWidget() {
	const [rating, setRating] = createSignal(3);
	const MIN = 1;
	const MAX = 5;
	const labels = ["Terrible", "Poor", "OK", "Good", "Excellent"];

	return (
		<Root
			class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
			value={rating()}
			textValue={labels[rating() - 1]}
			minValue={MIN}
			maxValue={MAX}
			onIncrement={() => setRating((r) => Math.min(r + 1, MAX))}
			onDecrement={() => setRating((r) => Math.max(r - 1, MIN))}
			onIncrementToMax={() => setRating(MAX)}
			onDecrementToMin={() => setRating(MIN)}
		>
			{Array.from({ length: MAX }, (_, i) => (
				<button
					type="button"
					class="text-xl leading-none focus:outline-none"
					style={{ color: i < rating() ? "#f59e0b" : "#d1d5db" }}
					onClick={() => setRating(i + 1)}
					tabindex="-1"
					aria-label={`Rate ${i + 1} out of ${MAX}`}
				>
					★
				</button>
			))}
		</Root>
	);
}

/** SpinButton wrapping a star-rating widget — Arrow keys still navigate the value. */
export const CustomWidget = meta.story({
	name: "Custom Widget",
	render: () => (
		<div class="flex flex-col gap-2 font-sans">
			<label class="text-sm font-medium text-slate-700">Rating</label>
			<RatingWidget />
			<p class="text-xs text-slate-500">
				Click a star or focus and use ↑↓ to change rating. Screen readers hear the text label.
			</p>
		</div>
	),
});

/** `validationState="invalid"` sets `aria-invalid` on the spinbutton region. */
function ValidatedCounter() {
	const [count, setCount] = createSignal(0);
	const MIN = 1;
	const MAX = 10;
	const isInvalid = () => count() < MIN;

	return (
		<div class="flex flex-col gap-1.5 font-sans">
			<label class="text-sm font-medium text-slate-700">Quantity (min 1)</label>
			<Root
				class="inline-flex w-36 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[invalid]:border-red-400"
				value={count()}
				textValue={String(count())}
				minValue={0}
				maxValue={MAX}
				validationState={isInvalid() ? "invalid" : "valid"}
				onIncrement={() => setCount((c) => Math.min(c + 1, MAX))}
				onDecrement={() => setCount((c) => Math.max(c - 1, 0))}
				onIncrementToMax={() => setCount(MAX)}
				onDecrementToMin={() => setCount(0)}
			>
				<button
					type="button"
					class="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-100"
					onClick={() => setCount((c) => Math.max(c - 1, 0))}
					tabindex="-1"
					aria-label="Decrement"
				>
					−
				</button>
				<span class="w-6 text-center text-sm font-medium text-slate-900 select-none">
					{count()}
				</span>
				<button
					type="button"
					class="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-100"
					onClick={() => setCount((c) => Math.min(c + 1, MAX))}
					tabindex="-1"
					aria-label="Increment"
				>
					+
				</button>
			</Root>
			{isInvalid() && (
				<p class="text-xs text-red-600" role="alert">
					Quantity must be at least 1.
				</p>
			)}
		</div>
	);
}

export const WithValidation = meta.story({
	name: "With Validation",
	render: () => <ValidatedCounter />,
});
