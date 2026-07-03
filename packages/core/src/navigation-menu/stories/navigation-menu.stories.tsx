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
} from "../index";

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

const rootClass =
	"relative flex items-center gap-0.5 rounded-lg bg-white border border-slate-200 px-2 py-1.5 shadow-sm font-sans text-sm";

const triggerClass =
	"flex items-center gap-1 rounded px-3 py-1.5 text-slate-700 font-medium hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[expanded]:bg-slate-100";

const contentClass =
	"w-[480px] rounded-lg border border-slate-200 bg-white p-4 shadow-lg outline-none";

const viewportClass =
	"relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg";

const linkClass =
	"flex flex-col gap-0.5 rounded-md p-3 hover:bg-slate-50 transition-colors cursor-pointer";

const itemTitleClass = "text-sm font-medium text-slate-800";
const itemDescClass = "text-xs text-slate-500 leading-relaxed";

/** Standard navigation with hover-open menus and a shared viewport. */
export const Default = meta.story({
	name: "Default",
	args: { delayDuration: 200, skipDelayDuration: 300 },
	render: (args) => (
		<Root
			class={rootClass}
			delayDuration={args.delayDuration as number}
			skipDelayDuration={args.skipDelayDuration as number}
		>
			<Menu>
				<Trigger class={triggerClass}>Products ▾</Trigger>
				<Portal>
					<Content class={contentClass}>
						<ul class="grid grid-cols-2 gap-2">
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Analytics</span>
									<span class={itemDescClass}>
										Understand your data with rich dashboards.
									</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Monitoring</span>
									<span class={itemDescClass}>
										Keep tabs on your service health.
									</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Alerts</span>
									<span class={itemDescClass}>
										Get notified before things go wrong.
									</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Logs</span>
									<span class={itemDescClass}>
										Search and filter all log events.
									</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<Menu>
				<Trigger class={triggerClass}>Docs ▾</Trigger>
				<Portal>
					<Content class={contentClass}>
						<ul class="flex flex-col gap-1">
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Getting started</span>
									<span class={itemDescClass}>
										Quick-start guide for new users.
									</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>API reference</span>
									<span class={itemDescClass}>
										Detailed endpoint documentation.
									</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Examples</span>
									<span class={itemDescClass}>
										Real-world integration patterns.
									</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<li>
				<a
					href="#"
					class="rounded px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-medium block"
				>
					Pricing
				</a>
			</li>
			<li>
				<a
					href="#"
					class="rounded px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-medium block"
				>
					Blog
				</a>
			</li>

			<Viewport class={viewportClass} />
		</Root>
	),
});

const animationCSS = `
  .nm-viewport {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: var(--kb-navigation-menu-viewport-width);
    height: var(--kb-navigation-menu-viewport-height);
    overflow-x: clip;
    overflow-y: visible;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: white;
    box-shadow: 0 8px 32px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06);
    z-index: 50;
    opacity: 0;
    pointer-events: none;
    transform-origin: var(--kb-menu-content-transform-origin);
    transition: width 300ms ease, height 300ms ease;
    animation: nm-vp-hide 200ms ease forwards;
  }
  .nm-viewport[data-expanded] {
    opacity: 1;
    pointer-events: auto;
    animation: nm-vp-show 220ms ease forwards;
  }
  .nm-content {
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
    pointer-events: none;
    animation-duration: 260ms;
    animation-timing-function: ease;
    animation-fill-mode: forwards;
  }
  .nm-content[data-expanded] { pointer-events: auto; }
  .nm-content[data-motion="from-start"] { animation-name: nm-from-left; }
  .nm-content[data-motion="from-end"]   { animation-name: nm-from-right; }
  .nm-content[data-motion="to-start"]   { animation-name: nm-to-left; }
  .nm-content[data-motion="to-end"]     { animation-name: nm-to-right; }
  @keyframes nm-vp-show {
    from { opacity: 0; transform: rotateX(-12deg) scale(0.96) translateY(-4px); }
    to   { opacity: 1; transform: rotateX(0deg)   scale(1)    translateY(0px); }
  }
  @keyframes nm-vp-hide {
    from { opacity: 1; transform: rotateX(0deg)   scale(1)    translateY(0px); }
    to   { opacity: 0; transform: rotateX(-8deg)  scale(0.97) translateY(-2px); }
  }
  @keyframes nm-from-right {
    from { opacity: 0; transform: translateX(60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes nm-from-left {
    from { opacity: 0; transform: translateX(-60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes nm-to-right {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(60px); }
  }
  @keyframes nm-to-left {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(-60px); }
  }
`;

/** Viewport fade + 3D-scale open/close, directional slides between panels, smooth width resize. */
export const Animated = meta.story({
	name: "Animated",
	render: () => (
		<>
			<style>{animationCSS}</style>
			<Root class={rootClass}>
				<Menu>
					<Trigger class={triggerClass}>Platform ▾</Trigger>
					<Portal>
						<Content class="nm-content w-[480px] p-5">
							<ul class="grid grid-cols-2 gap-2">
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Analytics</span>
										<span class={itemDescClass}>
											Rich dashboards and real-time insights.
										</span>
									</a>
								</li>
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Infrastructure</span>
										<span class={itemDescClass}>
											Scale your cloud resources.
										</span>
									</a>
								</li>
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Security</span>
										<span class={itemDescClass}>
											Protect your users and data.
										</span>
									</a>
								</li>
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Integrations</span>
										<span class={itemDescClass}>
											Connect with 200+ services.
										</span>
									</a>
								</li>
							</ul>
						</Content>
					</Portal>
				</Menu>

				<Menu>
					<Trigger class={triggerClass}>Resources ▾</Trigger>
					<Portal>
						<Content class="nm-content w-[340px] p-5">
							<ul class="flex flex-col gap-1">
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Documentation</span>
										<span class={itemDescClass}>Guides and API reference.</span>
									</a>
								</li>
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Blog</span>
										<span class={itemDescClass}>
											News and engineering deep-dives.
										</span>
									</a>
								</li>
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Community</span>
										<span class={itemDescClass}>
											Forum, Discord, and GitHub.
										</span>
									</a>
								</li>
							</ul>
						</Content>
					</Portal>
				</Menu>

				<li>
					<a
						href="#"
						class="rounded px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-medium block"
					>
						Pricing
					</a>
				</li>

				<Viewport class="nm-viewport">
					<Arrow class="fill-white stroke-slate-200" />
				</Viewport>
			</Root>
		</>
	),
});

/** Navigation with an arrow indicator pointing to the active trigger. */
export const WithArrow = meta.story({
	name: "With Arrow",
	render: () => (
		<Root class={rootClass}>
			<Menu>
				<Trigger class={triggerClass}>Features ▾</Trigger>
				<Portal>
					<Content class={contentClass}>
						<ul class="grid grid-cols-2 gap-2">
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Deployment</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>CI/CD</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Scaling</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Security</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<Menu>
				<Trigger class={triggerClass}>Company ▾</Trigger>
				<Portal>
					<Content class={contentClass}>
						<ul class="flex flex-col gap-1">
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>About</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Team</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Careers</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<li>
				<a
					href="#"
					class="rounded px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-medium block"
				>
					Contact
				</a>
			</li>

			<Viewport class={viewportClass}>
				<Arrow class="fill-white stroke-slate-200" />
			</Viewport>
		</Root>
	),
});

/** Controlled open value — the active item is driven externally. */
function ControlledDemo() {
	const [value, setValue] = createSignal<string | null>(null);

	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root class={rootClass} value={value()} onValueChange={setValue}>
				<Menu>
					<Trigger class={triggerClass}>Solutions ▾</Trigger>
					<Portal>
						<Content class={contentClass}>
							<ul class="flex flex-col gap-1">
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Enterprise</span>
									</a>
								</li>
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Startups</span>
									</a>
								</li>
							</ul>
						</Content>
					</Portal>
				</Menu>

				<Menu>
					<Trigger class={triggerClass}>Resources ▾</Trigger>
					<Portal>
						<Content class={contentClass}>
							<ul class="flex flex-col gap-1">
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Blog</span>
									</a>
								</li>
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Videos</span>
									</a>
								</li>
								<li>
									<a class={linkClass} href="#">
										<span class={itemTitleClass}>Community</span>
									</a>
								</li>
							</ul>
						</Content>
					</Portal>
				</Menu>

				<Viewport class={viewportClass} />
			</Root>

			<div class="flex items-center gap-2">
				<button
					class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
					onClick={() => setValue(null)}
				>
					Close all
				</button>
				<span class="text-xs text-slate-500">
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

/** Vertical layout — menus open to the right instead of below. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root
			class="relative flex flex-col gap-0.5 rounded-lg bg-white border border-slate-200 px-1.5 py-2 shadow-sm font-sans text-sm w-40"
			orientation="vertical"
		>
			<Menu>
				<Trigger class={triggerClass + " justify-between"}>Analytics ▸</Trigger>
				<Portal>
					<Content class="w-48 rounded-lg border border-slate-200 bg-white p-3 shadow-lg outline-none">
						<ul class="flex flex-col gap-1">
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Dashboard</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Reports</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Exports</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<Menu>
				<Trigger class={triggerClass + " justify-between"}>Settings ▸</Trigger>
				<Portal>
					<Content class="w-48 rounded-lg border border-slate-200 bg-white p-3 shadow-lg outline-none">
						<ul class="flex flex-col gap-1">
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Account</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Billing</span>
								</a>
							</li>
							<li>
								<a class={linkClass} href="#">
									<span class={itemTitleClass}>Security</span>
								</a>
							</li>
						</ul>
					</Content>
				</Portal>
			</Menu>

			<Separator class="my-1 h-px bg-slate-200" />

			<li>
				<a
					href="#"
					class="rounded px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-medium block"
				>
					Help
				</a>
			</li>

			<Viewport class={viewportClass} />
		</Root>
	),
});
