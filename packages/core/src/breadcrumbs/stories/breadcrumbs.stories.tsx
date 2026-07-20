import preview from "../../../../../.storybook/preview.js";
import { Link, Root, Separator } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Breadcrumbs",
	tags: ["autodocs"],
});

export default meta;

/** Three-level path with the default "/" separator. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.breadcrumbs__root}>
			<ol class={style.breadcrumbs__list}>
				<li>
					<Link class={style.breadcrumbs__link} href="#">
						Home
					</Link>
				</li>
				<Separator as="li" class={style.breadcrumbs__separator} />
				<li>
					<Link class={style.breadcrumbs__link} href="#">
						Library
					</Link>
				</li>
				<Separator as="li" class={style.breadcrumbs__separator} />
				<li>
					<Link class={style.breadcrumbs__link} current>
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
		<Root class={style.breadcrumbs__root} separator="›">
			<ol class={style.breadcrumbs__list}>
				<li>
					<Link class={style.breadcrumbs__link} href="#">
						Home
					</Link>
				</li>
				<Separator as="li" class={style.breadcrumbs__separator} />
				<li>
					<Link class={style.breadcrumbs__link} href="#">
						Products
					</Link>
				</li>
				<Separator as="li" class={style.breadcrumbs__separator} />
				<li>
					<Link class={style.breadcrumbs__link} current>
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
		<Root class={style.breadcrumbs__root} separator="·">
			<ol class={style.breadcrumbs__list}>
				<li>
					<Link class={style.breadcrumbs__link} href="#">
						Home
					</Link>
				</li>
				<Separator as="li" class={style.breadcrumbs__separator} />
				<li>
					<Link class={style.breadcrumbs__link} href="#">
						Docs
					</Link>
				</li>
				<Separator as="li" class={style.breadcrumbs__separator} />
				<li>
					<Link class={style.breadcrumbs__link} current>
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
		<Root class={style.breadcrumbs__root}>
			<ol class={style.breadcrumbs__list}>
				<li>
					<Link class={style.breadcrumbs__link} href="#">
						Home
					</Link>
				</li>
				<Separator as="li" class={style.breadcrumbs__separator} />
				<li>
					<Link class={style.breadcrumbs__link} disabled>
						Restricted
					</Link>
				</li>
				<Separator as="li" class={style.breadcrumbs__separator} />
				<li>
					<Link class={style.breadcrumbs__link} current>
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
			<Root class={style.breadcrumbs__root}>
				<ol class={style.breadcrumbs__list}>
					{crumbs.map((label, i) => (
						<>
							<li>
								<Link
									class={style.breadcrumbs__link}
									href={i < crumbs.length - 1 ? "#" : undefined}
									current={i === crumbs.length - 1}
								>
									{label}
								</Link>
							</li>
							{i < crumbs.length - 1 && (
								<Separator as="li" class={style.breadcrumbs__separator} />
							)}
						</>
					))}
				</ol>
			</Root>
		);
	},
});
