import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Alert",
	tags: ["autodocs"],
});

export default meta;

/** A plain alert with no decoration — role="alert" is always present. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={`${style.alert__base} ${style.alert__info}`}>
			Your session was saved successfully.
		</Root>
	),
});

/** Informational alert with a title and supporting text. */
export const WithTitle = meta.story({
	name: "With Title",
	render: () => (
		<Root class={`${style.alert__base} ${style.alert__info}`}>
			<div class={style.alert__text - group}>
				<p class={style.alert__title}>Update available</p>
				<p class={`${style.alert__body} ${style.alert__body - info}`}>
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
		<Root class={`${style.alert__base} ${style.alert__success}`}>
			<span
				class={`${style.alert__icon} ${style.alert__icon - success}`}
				aria-hidden="true"
			>
				✓
			</span>
			<div class={style.alert__text - group}>
				<p class={style.alert__title}>Payment confirmed</p>
				<p class={`${style.alert__body} ${style.alert__body - success}`}>
					Your order has been placed.
				</p>
			</div>
		</Root>
	),
});

/** A warning-state alert surfacing a non-blocking concern. */
export const Warning = meta.story({
	name: "Warning",
	render: () => (
		<Root class={`${style.alert__base} ${style.alert__warning}`}>
			<span
				class={`${style.alert__icon} ${style.alert__icon - warning}`}
				aria-hidden="true"
			>
				⚠
			</span>
			<div class={style.alert__text - group}>
				<p class={style.alert__title}>Storage nearly full</p>
				<p class={`${style.alert__body} ${style.alert__body - warning}`}>
					You have used 90% of your quota.
				</p>
			</div>
		</Root>
	),
});

/** A destructive-state alert indicating an error or failure. */
// biome-ignore lint/suspicious/noShadowRestrictedNames: Storybook story named "Error" for the error variant
export const Error = meta.story({
	name: "Error",
	render: () => (
		<Root class={`${style.alert__base} ${style.alert__error}`}>
			<span
				class={`${style.alert__icon} ${style.alert__icon - error}`}
				aria-hidden="true"
			>
				✕
			</span>
			<div class={style.alert__text - group}>
				<p class={style.alert__title}>Upload failed</p>
				<p class={`${style.alert__body} ${style.alert__body - error}`}>
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
		<div class={style.alert__variants}>
			{(
				[
					{
						icon: "ℹ",
						title: "Info",
						body: "Your changes will take effect after the next sync.",
						variant: "info",
					},
					{
						icon: "✓",
						title: "Success",
						body: "Deployment finished with no errors.",
						variant: "success",
					},
					{
						icon: "⚠",
						title: "Warning",
						body: "This action cannot be undone.",
						variant: "warning",
					},
					{
						icon: "✕",
						title: "Error",
						body: "Connection timed out. Check your network.",
						variant: "error",
					},
				] as const
			).map((v) => (
				<Root class={`${style.alert__base} ${style[`alert__${v.variant}`]}`}>
					<span
						class={`${style.alert__icon} ${style[`alert__icon-${v.variant}`]}`}
						aria-hidden="true"
					>
						{v.icon}
					</span>
					<div class={style.alert__text - group}>
						<p class={style.alert__title}>{v.title}</p>
						<p class={`${style.alert__body} ${style.alert__body - muted}`}>
							{v.body}
						</p>
					</div>
				</Root>
			))}
		</div>
	),
});
