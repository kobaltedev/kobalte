import preview from "../../../../../.storybook/preview.js";
import { Link, Root, Separator } from "../index";

const meta = preview.meta({
	title: "Components/Breadcrumbs",
	tags: ["autodocs"],
});

export default meta;

const navClass = "font-sans";
const listClass = "flex items-center gap-1 text-sm";
const linkClass =
	"text-blue-600 hover:underline data-[current]:text-slate-700 data-[current]:font-medium data-[current]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:pointer-events-none";
const separatorClass = "text-slate-400 select-none";

/** Three-level path with the default "/" separator. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={navClass}>
			<ol class={listClass}>
				<li>
					<Link class={linkClass} href="#">
						Home
					</Link>
				</li>
				<Separator as="li" class={separatorClass} />
				<li>
					<Link class={linkClass} href="#">
						Library
					</Link>
				</li>
				<Separator as="li" class={separatorClass} />
				<li>
					<Link class={linkClass} current>
						Data
					</Link>
				</li>
			</ol>
		</Root>
	),
});

/** A chevron-style separator passed to the root `separator` prop. */
export const ChevronSeparator = meta.story({
	name: "Chevron Separator",
	render: () => (
		<Root class={navClass} separator="›">
			<ol class={listClass}>
				<li>
					<Link class={linkClass} href="#">
						Home
					</Link>
				</li>
				<Separator as="li" class={separatorClass} />
				<li>
					<Link class={linkClass} href="#">
						Products
					</Link>
				</li>
				<Separator as="li" class={separatorClass} />
				<li>
					<Link class={linkClass} current>
						Shoes
					</Link>
				</li>
			</ol>
		</Root>
	),
});

/** A dot separator — `separator` accepts any string. */
export const DotSeparator = meta.story({
	name: "Dot Separator",
	render: () => (
		<Root class={navClass} separator="·">
			<ol class={listClass}>
				<li>
					<Link class={linkClass} href="#">
						Home
					</Link>
				</li>
				<Separator as="li" class={separatorClass} />
				<li>
					<Link class={linkClass} href="#">
						Docs
					</Link>
				</li>
				<Separator as="li" class={separatorClass} />
				<li>
					<Link class={linkClass} current>
						Getting started
					</Link>
				</li>
			</ol>
		</Root>
	),
});

/** A disabled ancestor — `disabled` prevents navigation without removing it. */
export const WithDisabledLink = meta.story({
	name: "With Disabled Link",
	render: () => (
		<Root class={navClass}>
			<ol class={listClass}>
				<li>
					<Link class={linkClass} href="#">
						Home
					</Link>
				</li>
				<Separator as="li" class={separatorClass} />
				<li>
					<Link class={linkClass} disabled>
						Restricted
					</Link>
				</li>
				<Separator as="li" class={separatorClass} />
				<li>
					<Link class={linkClass} current>
						Report
					</Link>
				</li>
			</ol>
		</Root>
	),
});

/** A longer path showing how a five-level hierarchy renders. */
export const DeepPath = meta.story({
	name: "Deep Path",
	render: () => {
		const crumbs = ["Home", "Org", "Workspace", "Project", "Settings"] as const;
		return (
			<Root class={navClass}>
				<ol class={listClass}>
					{crumbs.map((label, i) => (
						<>
							<li>
								<Link
									class={linkClass}
									href={i < crumbs.length - 1 ? "#" : undefined}
									current={i === crumbs.length - 1}
								>
									{label}
								</Link>
							</li>
							{i < crumbs.length - 1 && (
								<Separator as="li" class={separatorClass} />
							)}
						</>
					))}
				</ol>
			</Root>
		);
	},
});
