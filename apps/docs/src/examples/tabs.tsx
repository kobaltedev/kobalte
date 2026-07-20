import { Tabs } from "@kobalte/core/tabs";
import { createSignal, For } from "solid-js";
import style from "./tabs.module.css";

export function BasicExample() {
	return (
		<Tabs aria-label="Main navigation" class={style.tabs}>
			<Tabs.List class={style.tabs__list}>
				<Tabs.Trigger class={style.tabs__trigger} value="profile">
					Profile
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="dashboard">
					Dashboard
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="contact">
					Contact
				</Tabs.Trigger>
				<Tabs.Indicator class={style.tabs__indicator} />
			</Tabs.List>
			<Tabs.Content class={style.tabs__content} value="profile">
				Profile details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="dashboard">
				Dashboard details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="settings">
				Settings details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="contact">
				Contact details
			</Tabs.Content>
		</Tabs>
	);
}

export function DefaultValueExample() {
	return (
		<Tabs
			aria-label="Main navigation"
			defaultValue="dashboard"
			class={style.tabs}
		>
			<Tabs.List class={style.tabs__list}>
				<Tabs.Trigger class={style.tabs__trigger} value="profile">
					Profile
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="dashboard">
					Dashboard
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="contact">
					Contact
				</Tabs.Trigger>
				<Tabs.Indicator class={style.tabs__indicator} />
			</Tabs.List>
			<Tabs.Content class={style.tabs__content} value="profile">
				Profile details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="dashboard">
				Dashboard details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="settings">
				Settings details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="contact">
				Contact details
			</Tabs.Content>
		</Tabs>
	);
}

export function ControlledExample() {
	const [selectedTab, setSelectedTab] = createSignal("settings");

	return (
		<>
			<Tabs
				value={selectedTab()}
				onChange={setSelectedTab}
				aria-label="Main navigation"
				class={style.tabs}
			>
				<Tabs.List class={style.tabs__list}>
					<Tabs.Trigger class={style.tabs__trigger} value="profile">
						Profile
					</Tabs.Trigger>
					<Tabs.Trigger class={style.tabs__trigger} value="dashboard">
						Dashboard
					</Tabs.Trigger>
					<Tabs.Trigger class={style.tabs__trigger} value="settings">
						Settings
					</Tabs.Trigger>
					<Tabs.Trigger class={style.tabs__trigger} value="contact">
						Contact
					</Tabs.Trigger>
					<Tabs.Indicator class={style.tabs__indicator} />
				</Tabs.List>
				<Tabs.Content class={style.tabs__content} value="profile">
					Profile details
				</Tabs.Content>
				<Tabs.Content class={style.tabs__content} value="dashboard">
					Dashboard details
				</Tabs.Content>
				<Tabs.Content class={style.tabs__content} value="settings">
					Settings details
				</Tabs.Content>
				<Tabs.Content class={style.tabs__content} value="contact">
					Contact details
				</Tabs.Content>
			</Tabs>
			<p
				style={{ "font-size": "14px", "margin-top": "8px", "margin-bottom": 0 }}
			>
				Selected tab: {selectedTab()}
			</p>
		</>
	);
}

export function FocusableContentExample() {
	return (
		<Tabs aria-label="Main navigation" class={style.tabs}>
			<Tabs.List class={style.tabs__list}>
				<Tabs.Trigger class={style.tabs__trigger} value="profile">
					Profile
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="dashboard">
					Dashboard
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="contact">
					Contact
				</Tabs.Trigger>
				<Tabs.Indicator class={style.tabs__indicator} />
			</Tabs.List>
			<Tabs.Content class={style.tabs__content} value="profile">
				<input
					style={{
						border: "1px solid hsl(240 6% 90%)",
						color: "hsl(240 4% 16%)",
						"font-size": "14px",
						"border-radius": "6px",
						padding: "8px 12px",
						width: "100%",
						"box-sizing": "border-box",
					}}
					placeholder="Change password"
				/>
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="dashboard">
				Dashboard details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="settings">
				Settings details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="contact">
				Contact details
			</Tabs.Content>
		</Tabs>
	);
}

export function DynamicContentExample() {
	const [tabs, setTabs] = createSignal([
		{ id: "1", title: "Tab 1", content: "Tab body 1" },
		{ id: "2", title: "Tab 2", content: "Tab body 2" },
		{ id: "3", title: "Tab 3", content: "Tab body 3" },
	]);

	const addTab = () => {
		setTabs((prev) => [
			...prev,
			{
				id: String(prev.length + 1),
				title: `Tab ${prev.length + 1}`,
				content: `Tab Body ${prev.length + 1}`,
			},
		]);
	};

	const removeTab = () => {
		if (tabs().length > 1) {
			setTabs((prev) => prev.slice(0, -1));
		}
	};

	return (
		<>
			<div
				style={{
					display: "flex",
					"align-items": "center",
					gap: "8px",
					"margin-bottom": "8px",
				}}
			>
				<button
					type="button"
					style={{
						appearance: "none",
						outline: "none",
						height: "40px",
						padding: "0 16px",
						"border-radius": "6px",
						color: "white",
						"background-color": "hsl(200 98% 39%)",
						border: "none",
						cursor: "pointer",
					}}
					onClick={addTab}
				>
					Add tab
				</button>
				<button
					type="button"
					style={{
						appearance: "none",
						outline: "none",
						height: "40px",
						padding: "0 16px",
						"border-radius": "6px",
						color: "white",
						"background-color": "hsl(200 98% 39%)",
						border: "none",
						cursor: "pointer",
					}}
					onClick={removeTab}
				>
					Remove tab
				</button>
			</div>
			<Tabs>
				<Tabs.List class={style.tabs__list}>
					<For each={tabs()}>
						{(tab) => (
							<Tabs.Trigger class={style.tabs__trigger} value={tab.id}>
								{tab.title}
							</Tabs.Trigger>
						)}
					</For>
					<Tabs.Indicator class={style.tabs__indicator} />
				</Tabs.List>
				<For each={tabs()}>
					{(tab) => (
						<Tabs.Content class={style.tabs__content} value={tab.id}>
							{tab.content}
						</Tabs.Content>
					)}
				</For>
			</Tabs>
		</>
	);
}

export function ManualActivationExample() {
	return (
		<Tabs
			aria-label="Main navigation"
			activationMode="manual"
			class={style.tabs}
		>
			<Tabs.List class={style.tabs__list}>
				<Tabs.Trigger class={style.tabs__trigger} value="profile">
					Profile
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="dashboard">
					Dashboard
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="contact">
					Contact
				</Tabs.Trigger>
				<Tabs.Indicator class={style.tabs__indicator} />
			</Tabs.List>
			<Tabs.Content class={style.tabs__content} value="profile">
				Profile details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="dashboard">
				Dashboard details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="settings">
				Settings details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="contact">
				Contact details
			</Tabs.Content>
		</Tabs>
	);
}

export function VerticalOrientationExample() {
	return (
		<Tabs
			aria-label="Main navigation"
			orientation="vertical"
			class={style.tabs}
		>
			<Tabs.List class={style.tabs__list}>
				<Tabs.Trigger class={style.tabs__trigger} value="profile">
					Profile
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="dashboard">
					Dashboard
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="contact">
					Contact
				</Tabs.Trigger>
				<Tabs.Indicator class={style.tabs__indicator} />
			</Tabs.List>
			<Tabs.Content class={style.tabs__content} value="profile">
				Profile details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="dashboard">
				Dashboard details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="settings">
				Settings details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="contact">
				Contact details
			</Tabs.Content>
		</Tabs>
	);
}

export function DisabledTabsExample() {
	return (
		<Tabs aria-label="Main navigation" disabled class={style.tabs}>
			<Tabs.List class={style.tabs__list}>
				<Tabs.Trigger class={style.tabs__trigger} value="profile">
					Profile
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="dashboard">
					Dashboard
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="settings">
					Settings
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="contact">
					Contact
				</Tabs.Trigger>
				<Tabs.Indicator class={style.tabs__indicator} />
			</Tabs.List>
			<Tabs.Content class={style.tabs__content} value="profile">
				Profile details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="dashboard">
				Dashboard details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="settings">
				Settings details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="contact">
				Contact details
			</Tabs.Content>
		</Tabs>
	);
}

export function SingleDisabledTabExample() {
	return (
		<Tabs aria-label="Main navigation" class={style.tabs}>
			<Tabs.List class={style.tabs__list}>
				<Tabs.Trigger class={style.tabs__trigger} value="profile">
					Profile
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="dashboard">
					Dashboard
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="settings" disabled>
					Settings
				</Tabs.Trigger>
				<Tabs.Trigger class={style.tabs__trigger} value="contact">
					Contact
				</Tabs.Trigger>
				<Tabs.Indicator class={style.tabs__indicator} />
			</Tabs.List>
			<Tabs.Content class={style.tabs__content} value="profile">
				Profile details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="dashboard">
				Dashboard details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="settings">
				Settings details
			</Tabs.Content>
			<Tabs.Content class={style.tabs__content} value="contact">
				Contact details
			</Tabs.Content>
		</Tabs>
	);
}
