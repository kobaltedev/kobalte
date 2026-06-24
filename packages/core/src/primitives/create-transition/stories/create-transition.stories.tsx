import { createSignal } from "solid-js";
import preview from "../../../../../../.storybook/preview.js";
import { createTransition } from "../index";
import type { TransitionStyles } from "../index";

const meta = preview.meta({
	title: "Primitives/createTransition",
	tags: ["autodocs"],
});

export default meta;

const FADE: TransitionStyles = {
	in: { opacity: 1 },
	out: { opacity: 0 },
};

const SLIDE_UP: TransitionStyles = {
	in: { opacity: 1, transform: "translateY(0)" },
	out: { opacity: 0, transform: "translateY(16px)" },
};

const SLIDE_DOWN: TransitionStyles = {
	in: { opacity: 1, transform: "translateY(0)" },
	out: { opacity: 0, transform: "translateY(-16px)" },
};

const SCALE: TransitionStyles = {
	in: { opacity: 1, transform: "scale(1)" },
	out: { opacity: 0, transform: "scale(0.92)" },
};

const SCALE_Y: TransitionStyles = {
	in: { opacity: 1, transform: "scaleY(1)" },
	out: { opacity: 0, transform: "scaleY(0)" },
	common: { "transform-origin": "top" },
};

const btnClass =
	"rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 font-sans";

const boxClass =
	"rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-4 text-sm font-medium text-slate-700 font-sans shadow-sm";

function TransitionDemo(props: {
	transition: TransitionStyles;
	duration?: number;
	label: string;
}) {
	const [show, setShow] = createSignal(true);
	const { keepMounted, style } = createTransition(() => show(), {
		transition: props.transition,
		duration: props.duration ?? 300,
	});

	return (
		<div class="flex flex-col gap-3">
			<button class={btnClass} onClick={() => setShow((v) => !v)}>
				{show() ? "Hide" : "Show"}
			</button>
			<div style={{ "min-height": "60px" }}>
				{keepMounted() && (
					<div class={boxClass} style={style()}>
						{props.label}
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * `createTransition` drives enter/exit animations by computing inline styles
 * for each phase: `beforeEnter → enter → afterEnter` and `beforeExit → exit → afterExit`.
 * Pass `keepMounted()` to the `<Show>` gate and bind `style()` to the element.
 */
export const Fade = meta.story({
	name: "Fade",
	render: () => <TransitionDemo transition={FADE} label="Fade transition" />,
});

/** Slides up from below while fading in; reverses on exit. */
export const SlideUp = meta.story({
	name: "Slide Up",
	render: () => <TransitionDemo transition={SLIDE_UP} label="Slide up transition" />,
});

/** Slides down from above while fading in; reverses on exit. */
export const SlideDown = meta.story({
	name: "Slide Down",
	render: () => <TransitionDemo transition={SLIDE_DOWN} label="Slide down transition" />,
});

/** Scales up from slightly smaller while fading in; reverses on exit. */
export const Scale = meta.story({
	name: "Scale",
	render: () => <TransitionDemo transition={SCALE} label="Scale transition" />,
});

/** Expands/collapses vertically from the top edge. */
export const ScaleY = meta.story({
	name: "Scale Y",
	render: () => <TransitionDemo transition={SCALE_Y} label="Scale Y (dropdown-style)" />,
});

/** `duration` controls how long each enter/exit phase takes in milliseconds. */
export const SlowMotion = meta.story({
	name: "Slow Motion",
	render: () => <TransitionDemo transition={SCALE} duration={1200} label="1200ms scale transition" />,
});

/** `onBeforeEnter`, `onAfterEnter`, `onBeforeExit`, `onAfterExit` fire at each phase boundary. */
export const WithCallbacks = meta.story({
	name: "With Callbacks",
	render: () => {
		const [show, setShow] = createSignal(true);
		const [log, setLog] = createSignal<string[]>([]);

		const addLog = (msg: string) =>
			setLog((prev) => [`${new Date().toLocaleTimeString()} ${msg}`, ...prev].slice(0, 6));

		const { keepMounted, style } = createTransition(() => show(), {
			transition: FADE,
			duration: 400,
			onBeforeEnter: () => addLog("onBeforeEnter"),
			onAfterEnter: () => addLog("onAfterEnter"),
			onBeforeExit: () => addLog("onBeforeExit"),
			onAfterExit: () => addLog("onAfterExit"),
		});

		return (
			<div class="flex flex-col gap-3 font-sans">
				<button class={btnClass} onClick={() => setShow((v) => !v)}>
					{show() ? "Hide" : "Show"}
				</button>
				<div style={{ "min-height": "60px" }}>
					{keepMounted() && (
						<div class={boxClass} style={style()}>Fade with lifecycle callbacks</div>
					)}
				</div>
				<div class="rounded-md border border-slate-200 bg-slate-50 p-3 space-y-1">
					{log().length === 0
						? <p class="text-xs text-slate-400">Toggle to see lifecycle events…</p>
						: log().map((entry) => (
							<p class="text-xs font-mono text-slate-600">{entry}</p>
						))
					}
				</div>
			</div>
		);
	},
});

/** Custom `TransitionStyles` — any CSS property pair works as `in`/`out`. */
export const CustomStyles = meta.story({
	name: "Custom Styles",
	render: () => {
		const blur: TransitionStyles = {
			in: { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
			out: { opacity: 0, filter: "blur(8px)", transform: "scale(1.05)" },
		};
		return <TransitionDemo transition={blur} duration={400} label="Blur + scale transition" />;
	},
});
