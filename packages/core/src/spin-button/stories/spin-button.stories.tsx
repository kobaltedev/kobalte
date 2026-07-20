import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Primitives/SpinButton",
	tags: ["autodocs"],
});

export default meta;

function Counter() {
	const [count, setCount] = createSignal(0);
	const MIN = 0;
	const MAX = 10;

	return (
		<Root
			class={style.spinButtonRoot}
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
				class={style.spinButtonTrigger}
				onClick={() => setCount((c) => Math.max(c - 1, MIN))}
				disabled={count() <= MIN}
				tabindex="-1"
				aria-label="Decrement"
			>
				−
			</button>
			<span class={style.spinButtonValue}>{count()}</span>
			<button
				type="button"
				class={style.spinButtonTrigger}
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

export const Default = meta.story({
	name: "Default",
	render: () => (
		<div class={style.spinButtonContainer}>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: Visual label for ARIA spinbutton widget */}
			<label class={style.spinButtonLabel} id="counter-label">
				Counter (0–10)
			</label>
			<Counter />
			<p class={style.spinButtonDescription}>
				Click to focus, then use keyboard: ↑↓ step by 1, PgUp/PgDn step by 5,
				Home/End jump to min/max.
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
			class={style.spinButtonWrapper}
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
					class={style.spinButtonStar}
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

export const CustomWidget = meta.story({
	name: "Custom Widget",
	render: () => (
		<div class={style.spinButtonContainer}>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: Visual label for ARIA spinbutton widget */}
			<label class={style.spinButtonLabel}>Rating</label>
			<RatingWidget />
			<p class={style.spinButtonDescription}>
				Click a star or focus and use ↑↓ to change rating. Screen readers hear
				the text label.
			</p>
		</div>
	),
});

function ValidatedCounter() {
	const [count, setCount] = createSignal(0);
	const MIN = 1;
	const MAX = 10;
	const isInvalid = () => count() < MIN;

	return (
		<div class={style.spinButtonFormWrapper}>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: Visual label for ARIA spinbutton widget */}
			<label class={style.spinButtonLabel}>Quantity (min 1)</label>
			<Root
				class={[style.spinButtonRoot, style.spinButtonRootW36]}
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
					class={style.spinButtonTrigger}
					onClick={() => setCount((c) => Math.max(c - 1, 0))}
					tabindex="-1"
					aria-label="Decrement"
				>
					−
				</button>
				<span class={style.spinButtonValue}>{count()}</span>
				<button
					type="button"
					class={style.spinButtonTrigger}
					onClick={() => setCount((c) => Math.min(c + 1, MAX))}
					tabindex="-1"
					aria-label="Increment"
				>
					+
				</button>
			</Root>
			{isInvalid() && (
				<p class={style.spinButtonError} role="alert">
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
