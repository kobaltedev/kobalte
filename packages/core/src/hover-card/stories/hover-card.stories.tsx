import preview from "../../../../../.storybook/preview.js";
import { Arrow, Content, Portal, Root, Trigger } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/HoverCard",
	tags: ["autodocs"],
});

export default meta;

/** Opens when the cursor enters the link and closes after it leaves. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={style.hovercard__trigger} href="#">
				Hover over me
			</Trigger>
			<Portal>
				<Content class={style.hovercard__content}>
					<div class={style.hovercard__profile}>
						<div class={style.hovercard__avatar}>JD</div>
						<div>
							<p class={style.hovercard__name}>Jane Doe</p>
							<p class={style.hovercard__handle}>@janedoe</p>
						</div>
					</div>
					<p class={style.hovercard__bio}>
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
			<Trigger class={style.hovercard__trigger} href="#">
				With arrow
			</Trigger>
			<Portal>
				<Content class={style.hovercard__content}>
					<Arrow class={style.hovercard__arrow} />
					<p class={style.hovercard__text}>
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
			<Trigger class={style.hovercard__trigger} href="#">
				Open below
			</Trigger>
			<Portal>
				<Content class={style.hovercard__content}>
					<Arrow class={style["hovercard__arrow--bottom"]} />
					<p class={style.hovercard__text}>
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
			<Trigger class={style.hovercard__trigger} href="#">
				Fast hover card
			</Trigger>
			<Portal>
				<Content class={style.hovercard__content}>
					<p class={style.hovercard__text}>
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
			<Trigger class={style.hovercard__trigger} href="#">
				No safe area
			</Trigger>
			<Portal>
				<Content class={style.hovercard__content}>
					<p class={style.hovercard__text}>
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
			<Trigger class={style.hovercard__trigger} href="#">
				@solidjs
			</Trigger>
			<Portal>
				<Content class={style.hovercard__content}>
					<div class={style["hovercard__rich-header"]}>
						<div class={style["hovercard__rich-avatar"]}>S</div>
						<a href="#" class={style["hovercard__follow-link"]}>
							Follow
						</a>
					</div>
					<p class={style["hovercard__rich-title"]}>SolidJS</p>
					<p class={style["hovercard__rich-handle"]}>@solidjs</p>
					<p class={style["hovercard__rich-bio"]}>
						Simple and performant reactivity for building user interfaces.
					</p>
					<div class={style.hovercard__stats}>
						<span>
							<strong class={style["hovercard__stat-value"]}>1.2k</strong>{" "}
							Following
						</span>
						<span>
							<strong class={style["hovercard__stat-value"]}>42k</strong>{" "}
							Followers
						</span>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});
