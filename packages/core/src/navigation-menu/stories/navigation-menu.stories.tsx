import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Arrow,
	Content,
	Menu,
	Portal,
	Root,
	Separator,
	Trigger,
	Viewport,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/NavigationMenu",
	tags: ["autodocs"],
	argTypes: {
		delayDuration: { control: { type: "number", min: 0, max: 1000, step: 50 } },
		skipDelayDuration: {
			control: { type: "number", min: 0, max: 1000, step: 50 },
		},
	},
	args: {
		delayDuration: 200,
		skipDelayDuration: 300,
	},
});

export default meta;

export const Default = meta.story({
	name: "Default",
	args: { delayDuration: 200, skipDelayDuration: 300 },
	render: (args) => (
		<Root
			class={style.navigationMenuRoot}
			delayDuration={args.delayDuration as number}
			skipDelayDuration={args.skipDelayDuration as number}
		>
			<Menu>
				<Trigger class={style.navigationMenuTrigger}>Products ▾</Trigger>
				<Portal>
					<Content class={style.navigationMenuContent}>
						<ul class={style.navigationMenuGrid2}>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Analytics</span>
									<span class={style.navigationMenuItemDesc}>
										Understand your data with rich dashboards.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Monitoring</span>
									<span class={style.navigationMenuItemDesc}>
										Keep tabs on your service health.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Alerts</span>
									<span class={style.navigationMenuItemDesc}>
										Get notified before things go wrong.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Logs</span>
									<span class={style.navigationMenuItemDesc}>
										Search and filter all log events.
									</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<Menu>
				<Trigger class={style.navigationMenuTrigger}>Docs ▾</Trigger>
				<Portal>
					<Content class={style.navigationMenuContent}>
						<ul class={style.navigationMenuList}>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>
										Getting started
									</span>
									<span class={style.navigationMenuItemDesc}>
										Quick-start guide for new users.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>
										API reference
									</span>
									<span class={style.navigationMenuItemDesc}>
										Detailed endpoint documentation.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Examples</span>
									<span class={style.navigationMenuItemDesc}>
										Real-world integration patterns.
									</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<li>
				<a href="#" class={style.navigationMenuNavLink}>
					Pricing
				</a>
			</li>
			<li>
				<a href="#" class={style.navigationMenuNavLink}>
					Blog
				</a>
			</li>

			<Viewport class={style.navigationMenuViewport} />
		</Root>
	),
});

export const Animated = meta.story({
	name: "Animated",
	render: () => (
		<Root class={style.navigationMenuRoot}>
			<Menu>
				<Trigger class={style.navigationMenuTrigger}>Platform ▾</Trigger>
				<Portal>
					<Content
						class={[
							style.navigationMenuNmContent,
							style.navigationMenuContentP5,
						]}
					>
						<ul class={style.navigationMenuGrid2}>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Analytics</span>
									<span class={style.navigationMenuItemDesc}>
										Rich dashboards and real-time insights.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>
										Infrastructure
									</span>
									<span class={style.navigationMenuItemDesc}>
										Scale your cloud resources.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Security</span>
									<span class={style.navigationMenuItemDesc}>
										Protect your users and data.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>
										Integrations
									</span>
									<span class={style.navigationMenuItemDesc}>
										Connect with 200+ services.
									</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<Menu>
				<Trigger class={style.navigationMenuTrigger}>Resources ▾</Trigger>
				<Portal>
					<Content
						class={[
							style.navigationMenuNmContent,
							style.navigationMenuContentW340,
							style.navigationMenuContentP5,
						]}
					>
						<ul class={style.navigationMenuList}>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>
										Documentation
									</span>
									<span class={style.navigationMenuItemDesc}>
										Guides and API reference.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Blog</span>
									<span class={style.navigationMenuItemDesc}>
										News and engineering deep-dives.
									</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Community</span>
									<span class={style.navigationMenuItemDesc}>
										Forum, Discord, and GitHub.
									</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<li>
				<a href="#" class={style.navigationMenuNavLink}>
					Pricing
				</a>
			</li>

			<Viewport class={style.navigationMenuNmViewport}>
				<Arrow class={style.navigationMenuArrow} />
			</Viewport>
		</Root>
	),
});

export const WithArrow = meta.story({
	name: "With Arrow",
	render: () => (
		<Root class={style.navigationMenuRoot}>
			<Menu>
				<Trigger class={style.navigationMenuTrigger}>Features ▾</Trigger>
				<Portal>
					<Content class={style.navigationMenuContent}>
						<ul class={style.navigationMenuGrid2}>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Deployment</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>CI/CD</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Scaling</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Security</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<Menu>
				<Trigger class={style.navigationMenuTrigger}>Company ▾</Trigger>
				<Portal>
					<Content class={style.navigationMenuContent}>
						<ul class={style.navigationMenuList}>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>About</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Team</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Careers</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<li>
				<a href="#" class={style.navigationMenuNavLink}>
					Contact
				</a>
			</li>

			<Viewport class={style.navigationMenuViewport}>
				<Arrow class={style.navigationMenuArrow} />
			</Viewport>
		</Root>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal<string | null>(null);

	return (
		<div class={style.navigationMenuWrapper}>
			<Root
				class={style.navigationMenuRoot}
				value={value()}
				onValueChange={setValue}
			>
				<Menu>
					<Trigger class={style.navigationMenuTrigger}>Solutions ▾</Trigger>
					<Portal>
						<Content class={style.navigationMenuContent}>
							<ul class={style.navigationMenuList}>
								<li>
									<a class={style.navigationMenuLink} href="#">
										<span class={style.navigationMenuItemTitle}>
											Enterprise
										</span>
									</a>
								</li>
								<li>
									<a class={style.navigationMenuLink} href="#">
										<span class={style.navigationMenuItemTitle}>Startups</span>
									</a>
								</li>
							</ul>
						</Content>
					</Portal>
				</Menu>

				<Menu>
					<Trigger class={style.navigationMenuTrigger}>Resources ▾</Trigger>
					<Portal>
						<Content class={style.navigationMenuContent}>
							<ul class={style.navigationMenuList}>
								<li>
									<a class={style.navigationMenuLink} href="#">
										<span class={style.navigationMenuItemTitle}>Blog</span>
									</a>
								</li>
								<li>
									<a class={style.navigationMenuLink} href="#">
										<span class={style.navigationMenuItemTitle}>Videos</span>
									</a>
								</li>
								<li>
									<a class={style.navigationMenuLink} href="#">
										<span class={style.navigationMenuItemTitle}>Community</span>
									</a>
								</li>
							</ul>
						</Content>
					</Portal>
				</Menu>

				<Viewport class={style.navigationMenuViewport} />
			</Root>

			<div class={style.navigationMenuControlRow}>
				<button
					type="button"
					class={style.navigationMenuCloseButton}
					onClick={() => setValue(null)}
				>
					Close all
				</button>
				<span class={style.navigationMenuStateText}>
					Active: <strong>{value() ?? "none"}</strong>
				</span>
			</div>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root
			class={[style.navigationMenuRoot, style.navigationMenuRootVertical]}
			orientation="vertical"
		>
			<Menu>
				<Trigger
					class={[
						style.navigationMenuTrigger,
						style.navigationMenuTriggerJustify,
					]}
				>
					Analytics ▸
				</Trigger>
				<Portal>
					<Content
						class={[
							style.navigationMenuContent,
							style.navigationMenuContentW48,
							style.navigationMenuContentP3,
						]}
					>
						<ul class={style.navigationMenuList}>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Dashboard</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Reports</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Exports</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<Menu>
				<Trigger
					class={[
						style.navigationMenuTrigger,
						style.navigationMenuTriggerJustify,
					]}
				>
					Settings ▸
				</Trigger>
				<Portal>
					<Content
						class={[
							style.navigationMenuContent,
							style.navigationMenuContentW48,
							style.navigationMenuContentP3,
						]}
					>
						<ul class={style.navigationMenuList}>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Account</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Billing</span>
								</a>
							</li>
							<li>
								<a class={style.navigationMenuLink} href="#">
									<span class={style.navigationMenuItemTitle}>Security</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<Separator class={style.navigationMenuSeparator} />

			<li>
				<a href="#" class={style.navigationMenuNavLink}>
					Help
				</a>
			</li>

			<Viewport class={style.navigationMenuViewport} />
		</Root>
	),
});
