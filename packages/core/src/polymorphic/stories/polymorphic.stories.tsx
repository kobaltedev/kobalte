import { createSignal, type ValidComponent } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Button } from "../../button/index.tsx";
import { Polymorphic, type PolymorphicProps } from "../polymorphic.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Primitives/Polymorphic",
	tags: ["autodocs"],
});

export default meta;

/**
 * Render any HTML element by changing the `as` prop. All forwarded attributes
 * (ARIA, data-*, tabIndex, href, etc.) are passed straight through to the DOM.
 */
export const NativeElement = meta.story({
	name: "Native Element",
	args: {
		tag: "button",
		label: "Polymorphic element",
	},
	argTypes: {
		tag: {
			control: "select",
			options: ["div", "button", "a", "span", "section", "p", "h3"],
		},
		label: { control: "text" },
	},
	render: (args) => (
		<Polymorphic
			as={args.tag as unknown as ValidComponent}
			class={style.element}
		>
			{args.label}
			<code class={style.codeBadge}>&lt;{args.tag}&gt;</code>
		</Polymorphic>
	),
});

interface CardProps {
	variant?: "primary" | "secondary";
	children?: any;
	class?: string;
	[key: string]: any;
}

function Card(props: CardProps) {
	return (
		<div
			class={[
				style.card,
				props.variant === "primary" ? style.cardPrimary : style.cardSecondary,
			]}
			{...props}
		/>
	);
}

/** The `as` prop accepts any Solid component. Props exclusive to that component
 * (like `variant`) are forwarded and handled by the target component. */
export const AsCustomComponent = meta.story({
	name: "As Custom Component",
	args: { variant: "primary" as "primary" | "secondary" },
	argTypes: {
		variant: { control: "select", options: ["primary", "secondary"] },
	},
	render: (args) => (
		<Polymorphic as={Card} variant={args.variant}>
			{args.variant === "primary" ? "Primary Card" : "Secondary Card"}
		</Polymorphic>
	),
});

/** Standard HTML attributes — `id`, `data-*`, `aria-*`, `tabIndex` — all pass
 * through unchanged to the underlying DOM node. Click the button to inspect them. */
export const PropForwarding = meta.story({
	name: "Prop Forwarding",
	render: () => {
		const [ref, setRef] = createSignal<HTMLButtonElement>();
		const [info, setInfo] = createSignal("");

		return (
			<div class={style.stack}>
				<Polymorphic
					as="button"
					id="poly-button"
					data-testid="poly-button"
					data-custom="hello"
					aria-label="A labelled polymorphic button"
					tabIndex={0}
					class={style.element}
					ref={setRef}
					onClick={() =>
						setInfo(
							`id=${ref()?.id}  data-custom=${ref()?.dataset.custom}  tagName=${ref()?.tagName}`,
						)
					}
				>
					Click to inspect forwarded attrs
				</Polymorphic>
				{info() && <code class={style.codeOutput}>{info()}</code>}
			</div>
		);
	},
});

/** In Solid 2.0, `class` accepts a string, object, or array. All forms pass
 * through `Polymorphic` unchanged; signals update the DOM in-place. */
export const ReactiveClass = meta.story({
	name: "Reactive class Prop",
	render: () => {
		const [active, setActive] = createSignal(false);

		return (
			<div class={style.stack}>
				<Polymorphic
					as="button"
					class={[
						style.toggle,
						active() ? style.toggleActive : style.toggleInactive,
					]}
					onClick={() => setActive((v) => !v)}
				>
					Toggle active — {active() ? "on" : "off"}
				</Polymorphic>
				<p class={style.hint}>
					class array + reactive condition — DOM updates without re-mounting.
				</p>
			</div>
		);
	},
});

/** The `ref` prop captures the underlying DOM element, giving direct access to
 * imperative APIs like `getBoundingClientRect`. */
export const RefAccess = meta.story({
	name: "Ref Access",
	render: () => {
		let el: HTMLDivElement | undefined;
		const [info, setInfo] = createSignal("");

		return (
			<div class={style.stack}>
				<Polymorphic
					as="div"
					ref={el}
					class={style.element}
					onClick={() =>
						setInfo(
							`tagName=${el?.tagName}  width=${el?.getBoundingClientRect().width.toFixed(0)}px`,
						)
					}
				>
					Click to inspect ref
				</Polymorphic>
				{info() && <code class={style.codeOutput}>{info()}</code>}
			</div>
		);
	},
});

/** The `as` prop is fully reactive — switch the rendered tag without unmounting. */
export const DynamicAs = meta.story({
	name: "Dynamic As",
	render: () => {
		const options = ["div", "button", "a", "span"] as const;
		const [tag, setTag] = createSignal<(typeof options)[number]>("div");

		return (
			<div class={style.stackWide}>
				<div class={style.tagRow}>
					{options.map((t) => (
						<button
							type="button"
							onClick={() => setTag(t)}
							class={[
								style.tagButton,
								tag() === t ? style.tagButtonActive : style.tagButtonInactive,
							]}
						>
							{t}
						</button>
					))}
				</div>
				<Polymorphic as={tag()} class={style.element}>
					Rendered as <code class={style.codeTag}>&lt;{tag()}&gt;</code>
				</Polymorphic>
			</div>
		);
	},
});

/** Kobalte's `Button` defaults to `as="button"`. Override with the control below
 * to switch the rendered element while preserving accessibility semantics. */
export const ButtonAsElement = meta.story({
	name: "Kobalte Button → as",
	args: { as: "button" as string },
	argTypes: {
		as: { control: "select", options: ["button", "a", "div"] },
	},
	render: (args) => (
		<Button
			as={args.as as unknown as ValidComponent}
			href={args.as === "a" ? "https://kobalte.dev" : undefined}
			target={args.as === "a" ? "_blank" : undefined}
			rel={args.as === "a" ? "noopener noreferrer" : undefined}
			class={style.button}
		>
			as=&quot;{args.as}&quot;
			<code class={style.codeBadgeSlate}>{args.as}</code>
		</Button>
	),
});

/** A consumer-authored typed polymorphic helper built on top of `PolymorphicProps`.
 * The component accepts its own props alongside the chosen element's native props. */
export const TypedPolymorphic = meta.story({
	name: "Typed Polymorphic Component",
	args: { intent: "default" as "default" | "action" },
	argTypes: {
		intent: { control: "select", options: ["default", "action"] },
	},
	render: (args) => {
		function Block<T extends ValidComponent>(
			props: PolymorphicProps<T, { intent?: "default" | "action" }>,
		) {
			return (
				<Polymorphic
					{...props}
					as={props.as!}
					class={`${style.block} ${
						props.intent === "action" ? style.blockAction : style.blockDefault
					}`}
				/>
			);
		}

		const intentClass = [
			style.block,
			args.intent === "action" ? style.blockAction : style.blockDefault,
		];

		return (
			<div class={style.stackWrap}>
				<Polymorphic as="div" class={intentClass}>
					Native div
				</Polymorphic>
				<Block
					as={Button}
					intent={args.intent}
					onClick={() => alert("Block button clicked")}
				>
					Kobalte Button
				</Block>
			</div>
		);
	},
});

/** `Polymorphic` throws synchronously when `as` is omitted. Toggle the button to
 * mount the broken component and observe the caught error. */
export const MissingAsProp = meta.story({
	name: "Missing as Prop",
	render: () => {
		const [show, setShow] = createSignal(false);

		return (
			<div class={style.stack}>
				<button
					type="button"
					class={style.toggleButton}
					onClick={() => setShow((v) => !v)}
				>
					{show() ? "Unmount" : "Mount with missing as"}
				</button>
				{show() &&
					(() => {
						try {
							return <Polymorphic>broken</Polymorphic>;
						} catch (e: unknown) {
							return <p class={style.error}>Error: {(e as Error).message}</p>;
						}
					})()}
			</div>
		);
	},
});
