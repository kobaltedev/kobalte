import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Content, Indicator, List, Root, Trigger } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Tabs",
	tags: ["autodocs"],
});

export default meta;

/** A basic tab set with three panels. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.tabs__root} defaultValue="account">
			<List class={style.tabs__list}>
				<Trigger class={style.tabs__trigger} value="account">
					Account
				</Trigger>
				<Trigger class={style.tabs__trigger} value="password">
					Password
				</Trigger>
				<Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Trigger>
				<Indicator class={style.tabs__indicator} />
			</List>
			<Content class={style.tabs__content} value="account">
				Manage your account details and preferences.
			</Content>
			<Content class={style.tabs__content} value="password">
				Change your password and security settings.
			</Content>
			<Content class={style.tabs__content} value="settings">
				Configure application-wide settings.
			</Content>
		</Root>
	),
});

/** `value` + `onChange` give full external control over the active tab. */
function ControlledDemo() {
	const [tab, setTab] = createSignal("account");
	return (
		<div class={style.tabs__demo}>
			<Root class={style.tabs__root} value={tab()} onChange={setTab}>
				<List class={style.tabs__list}>
					<Trigger class={style.tabs__trigger} value="account">
						Account
					</Trigger>
					<Trigger class={style.tabs__trigger} value="password">
						Password
					</Trigger>
					<Trigger class={style.tabs__trigger} value="settings">
						Settings
					</Trigger>
					<Indicator class={style.tabs__indicator} />
				</List>
				<Content class={style.tabs__content} value="account">
					Manage your account details and preferences.
				</Content>
				<Content class={style.tabs__content} value="password">
					Change your password and security settings.
				</Content>
				<Content class={style.tabs__content} value="settings">
					Configure application-wide settings.
				</Content>
			</Root>
			<p class={style.tabs__text}>
				Active tab: <strong>{tab()}</strong>
			</p>
			<button
				type="button"
				class={style.tabs__button}
				onClick={() => setTab("account")}
			>
				Reset to Account
			</button>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** `activationMode="manual"` requires pressing Enter/Space after focusing a tab. */
export const ManualActivation = meta.story({
	name: "Manual Activation",
	render: () => (
		<Root
			class={style.tabs__root}
			defaultValue="account"
			activationMode="manual"
		>
			<List class={style.tabs__list}>
				<Trigger class={style.tabs__trigger} value="account">
					Account
				</Trigger>
				<Trigger class={style.tabs__trigger} value="password">
					Password
				</Trigger>
				<Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Trigger>
				<Indicator class={style.tabs__indicator} />
			</List>
			<Content class={style.tabs__content} value="account">
				Focus a tab and press Enter or Space to activate it.
			</Content>
			<Content class={style.tabs__content} value="password">
				Change your password and security settings.
			</Content>
			<Content class={style.tabs__content} value="settings">
				Configure application-wide settings.
			</Content>
		</Root>
	),
});

/** `orientation="vertical"` stacks tabs on the left side. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root
			class={style["tabs__root--vertical"]}
			defaultValue="account"
			orientation="vertical"
		>
			<List class={style["tabs__list--vertical"]}>
				<Trigger class={style["tabs__trigger--vertical"]} value="account">
					Account
				</Trigger>
				<Trigger class={style["tabs__trigger--vertical"]} value="password">
					Password
				</Trigger>
				<Trigger class={style["tabs__trigger--vertical"]} value="settings">
					Settings
				</Trigger>
				<Indicator class={style["tabs__indicator--vertical"]} />
			</List>
			<div class={style.tabs__contentInner}>
				<Content class={style.tabs__content} value="account">
					Manage your account details and preferences.
				</Content>
				<Content class={style.tabs__content} value="password">
					Change your password and security settings.
				</Content>
				<Content class={style.tabs__content} value="settings">
					Configure application-wide settings.
				</Content>
			</div>
		</Root>
	),
});

/** A single tab can be disabled independently. */
export const DisabledTab = meta.story({
	name: "Disabled Tab",
	render: () => (
		<Root class={style.tabs__root} defaultValue="account">
			<List class={style.tabs__list}>
				<Trigger class={style.tabs__trigger} value="account">
					Account
				</Trigger>
				<Trigger class={style.tabs__trigger} value="password" disabled>
					Password
				</Trigger>
				<Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Trigger>
				<Indicator class={style.tabs__indicator} />
			</List>
			<Content class={style.tabs__content} value="account">
				Manage your account details and preferences.
			</Content>
			<Content class={style.tabs__content} value="password">
				Change your password and security settings.
			</Content>
			<Content class={style.tabs__content} value="settings">
				Configure application-wide settings.
			</Content>
		</Root>
	),
});

/** `disabled` on the root prevents all tab switching. */
export const DisabledRoot = meta.story({
	name: "Disabled Root",
	render: () => (
		<Root class={style.tabs__root} defaultValue="account" disabled>
			<List class={style.tabs__list}>
				<Trigger class={style.tabs__trigger} value="account">
					Account
				</Trigger>
				<Trigger class={style.tabs__trigger} value="password">
					Password
				</Trigger>
				<Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Trigger>
				<Indicator class={style.tabs__indicator} />
			</List>
			<Content class={style.tabs__content} value="account">
				All tabs are disabled — no switching is possible.
			</Content>
			<Content class={style.tabs__content} value="password">
				Change your password and security settings.
			</Content>
			<Content class={style.tabs__content} value="settings">
				Configure application-wide settings.
			</Content>
		</Root>
	),
});

/** `forceMount` keeps all panels in the DOM regardless of selection. */
export const ForceMount = meta.story({
	name: "Force Mount",
	render: () => (
		<Root class={style.tabs__root} defaultValue="account">
			<List class={style.tabs__list}>
				<Trigger class={style.tabs__trigger} value="account">
					Account
				</Trigger>
				<Trigger class={style.tabs__trigger} value="password">
					Password
				</Trigger>
				<Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Trigger>
				<Indicator class={style.tabs__indicator} />
			</List>
			<Content
				class={`${style.tabs__content} ${style["tabs__content--hidden"]}`}
				value="account"
				forceMount
			>
				Always in the DOM — useful for CSS-only transitions.
			</Content>
			<Content
				class={`${style.tabs__content} ${style["tabs__content--hidden"]}`}
				value="password"
				forceMount
			>
				Change your password and security settings.
			</Content>
			<Content
				class={`${style.tabs__content} ${style["tabs__content--hidden"]}`}
				value="settings"
				forceMount
			>
				Configure application-wide settings.
			</Content>
		</Root>
	),
});
