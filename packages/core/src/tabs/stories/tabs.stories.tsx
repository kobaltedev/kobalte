import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Content, Indicator, List, Root, Trigger } from "../index";

const meta = preview.meta({
	title: "Components/Tabs",
	tags: ["autodocs"],
});

export default meta;

// ── Shared styles ──────────────────────────────────────────────────────────

const rootClass = "relative font-sans w-96";

const listClass =
	"relative flex border-b border-slate-200";

const triggerClass =
	"relative px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-slate-900 data-[selected]:text-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset";

const contentClass =
	"pt-4 text-sm text-slate-700 focus-visible:outline-none";

const indicatorClass =
	"absolute bottom-0 h-0.5 bg-blue-500 transition-transform duration-200";

// ── Stories ────────────────────────────────────────────────────────────────

/** A basic tab set with three panels. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={rootClass} defaultValue="account">
			<List class={listClass}>
				<Trigger class={triggerClass} value="account">Account</Trigger>
				<Trigger class={triggerClass} value="password">Password</Trigger>
				<Trigger class={triggerClass} value="settings">Settings</Trigger>
				<Indicator class={indicatorClass} />
			</List>
			<Content class={contentClass} value="account">
				Manage your account details and preferences.
			</Content>
			<Content class={contentClass} value="password">
				Change your password and security settings.
			</Content>
			<Content class={contentClass} value="settings">
				Configure application-wide settings.
			</Content>
		</Root>
	),
});

/** `value` + `onChange` give full external control over the active tab. */
function ControlledDemo() {
	const [tab, setTab] = createSignal("account");
	return (
		<div class="flex flex-col gap-4 font-sans">
			<Root class={rootClass} value={tab()} onChange={setTab}>
				<List class={listClass}>
					<Trigger class={triggerClass} value="account">Account</Trigger>
					<Trigger class={triggerClass} value="password">Password</Trigger>
					<Trigger class={triggerClass} value="settings">Settings</Trigger>
					<Indicator class={indicatorClass} />
				</List>
				<Content class={contentClass} value="account">
					Manage your account details and preferences.
				</Content>
				<Content class={contentClass} value="password">
					Change your password and security settings.
				</Content>
				<Content class={contentClass} value="settings">
					Configure application-wide settings.
				</Content>
			</Root>
			<p class="text-xs text-slate-500">
				Active tab: <strong>{tab()}</strong>
			</p>
			<button
				type="button"
				class="self-start rounded px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
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
		<Root class={rootClass} defaultValue="account" activationMode="manual">
			<List class={listClass}>
				<Trigger class={triggerClass} value="account">Account</Trigger>
				<Trigger class={triggerClass} value="password">Password</Trigger>
				<Trigger class={triggerClass} value="settings">Settings</Trigger>
				<Indicator class={indicatorClass} />
			</List>
			<Content class={contentClass} value="account">
				Focus a tab and press Enter or Space to activate it.
			</Content>
			<Content class={contentClass} value="password">
				Change your password and security settings.
			</Content>
			<Content class={contentClass} value="settings">
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
			class="flex flex-row gap-4 font-sans w-[28rem]"
			defaultValue="account"
			orientation="vertical"
		>
			<List class="relative flex flex-col border-r border-slate-200 pr-0 shrink-0 w-32">
				<Trigger
					class="relative px-4 py-2 text-sm font-medium text-left text-slate-600 transition-colors hover:text-slate-900 data-[selected]:text-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
					value="account"
				>
					Account
				</Trigger>
				<Trigger
					class="relative px-4 py-2 text-sm font-medium text-left text-slate-600 transition-colors hover:text-slate-900 data-[selected]:text-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
					value="password"
				>
					Password
				</Trigger>
				<Trigger
					class="relative px-4 py-2 text-sm font-medium text-left text-slate-600 transition-colors hover:text-slate-900 data-[selected]:text-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
					value="settings"
				>
					Settings
				</Trigger>
				<Indicator class="absolute right-0 w-0.5 bg-blue-500 transition-transform duration-200" />
			</List>
			<div class="flex-1">
				<Content class={contentClass} value="account">
					Manage your account details and preferences.
				</Content>
				<Content class={contentClass} value="password">
					Change your password and security settings.
				</Content>
				<Content class={contentClass} value="settings">
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
		<Root class={rootClass} defaultValue="account">
			<List class={listClass}>
				<Trigger class={triggerClass} value="account">Account</Trigger>
				<Trigger class={triggerClass} value="password" disabled>
					Password
				</Trigger>
				<Trigger class={triggerClass} value="settings">Settings</Trigger>
				<Indicator class={indicatorClass} />
			</List>
			<Content class={contentClass} value="account">
				Manage your account details and preferences.
			</Content>
			<Content class={contentClass} value="password">
				Change your password and security settings.
			</Content>
			<Content class={contentClass} value="settings">
				Configure application-wide settings.
			</Content>
		</Root>
	),
});

/** `disabled` on the root prevents all tab switching. */
export const DisabledRoot = meta.story({
	name: "Disabled Root",
	render: () => (
		<Root class={rootClass} defaultValue="account" disabled>
			<List class={listClass}>
				<Trigger class={triggerClass} value="account">Account</Trigger>
				<Trigger class={triggerClass} value="password">Password</Trigger>
				<Trigger class={triggerClass} value="settings">Settings</Trigger>
				<Indicator class={indicatorClass} />
			</List>
			<Content class={contentClass} value="account">
				All tabs are disabled — no switching is possible.
			</Content>
			<Content class={contentClass} value="password">
				Change your password and security settings.
			</Content>
			<Content class={contentClass} value="settings">
				Configure application-wide settings.
			</Content>
		</Root>
	),
});

/** `forceMount` keeps all panels in the DOM regardless of selection. */
export const ForceMount = meta.story({
	name: "Force Mount",
	render: () => (
		<Root class={rootClass} defaultValue="account">
			<List class={listClass}>
				<Trigger class={triggerClass} value="account">Account</Trigger>
				<Trigger class={triggerClass} value="password">Password</Trigger>
				<Trigger class={triggerClass} value="settings">Settings</Trigger>
				<Indicator class={indicatorClass} />
			</List>
			<Content class={[contentClass, "data-[selected]:block hidden"].join(" ")} value="account" forceMount>
				Always in the DOM — useful for CSS-only transitions.
			</Content>
			<Content class={[contentClass, "data-[selected]:block hidden"].join(" ")} value="password" forceMount>
				Change your password and security settings.
			</Content>
			<Content class={[contentClass, "data-[selected]:block hidden"].join(" ")} value="settings" forceMount>
				Configure application-wide settings.
			</Content>
		</Root>
	),
});
