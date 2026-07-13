import docsearch from "@docsearch/js";
import { useMatch } from "@solidjs/router";
import { onMount } from "solid-js";

import {
	useDefaultThemeComponents,
	useDefaultThemeState,
} from "@kobalte/solidbase/default-theme/context.jsx";
import { version } from "../../../../../packages/core/package.json";

import styles from "./Header.module.css";

export default function Header() {
	const isChangelogPath = useMatch(() => "/docs/changelog/*rest");
	const { ThemeSelector } = useDefaultThemeComponents();
	const { setSidebarOpen } = useDefaultThemeState();

	onMount(() => {
		docsearch({
			appId: "H7ZQSI0SAN",
			apiKey: "c9354456dd4bb74c37e4d2b762b89b88",
			indexName: "kobalte",
			container: "#docsearch",
		});
	});

	return (
		<header class={styles.header}>
			<button
				type="button"
				class={styles.menu}
				aria-label="Open navigation"
				onClick={() => setSidebarOpen(true)}
			>
				<MenuIcon />
			</button>

			<div class={styles.brand}>
				<a href="/">
					Kobalte<span>.</span>
				</a>
				<span class={styles.version}>v{version}</span>
			</div>

			<div class={styles.actions}>
				<div id="docsearch" class={styles.search} />
				<nav class={styles.nav} aria-label="Primary navigation">
					<a
						href="/docs/core/overview/introduction"
						data-active={!isChangelogPath() || undefined}
					>
						Components
					</a>
					<a
						href="/docs/changelog"
						data-active={isChangelogPath() || undefined}
					>
						Changelog
					</a>
				</nav>
				<a
					href="https://github.com/kobaltedev/kobalte"
					target="_blank"
					rel="noopener noreferrer"
					class={styles.iconButton}
					aria-label="GitHub"
				>
					<GitHubIcon />
				</a>
				<div class={styles.themeSelector}>
					<ThemeSelector />
				</div>
			</div>
		</header>
	);
}

function MenuIcon() {
	return (
		<svg viewBox="0 0 15 15" aria-hidden="true">
			<path d="M1.5 3a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1h-12Zm0 4a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1h-12Zm0 4a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1h-12Z" />
		</svg>
	);
}

function GitHubIcon() {
	return (
		<svg viewBox="0 0 15 15" aria-hidden="true">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M7.499.25a7.25 7.25 0 0 0-2.291 14.13c.363.066.495-.158.495-.35 0-.173-.006-.628-.01-1.233-2.016.438-2.442-.972-2.442-.972-.33-.838-.805-1.06-.805-1.06-.658-.45.05-.441.05-.441.728.051 1.11.747 1.11.747.647 1.108 1.697.788 2.11.602.066-.468.253-.788.46-.969-1.61-.183-3.302-.806-3.302-3.584 0-.792.283-1.438.746-1.945-.075-.183-.324-.92.072-1.918 0 0 .608-.195 1.993.743a6.94 6.94 0 0 1 3.63 0c1.384-.938 1.992-.743 1.992-.743.396.998.147 1.735.073 1.918.464.507.744 1.153.744 1.945 0 2.785-1.695 3.398-3.31 3.578.26.224.492.666.492 1.343 0 .969-.009 1.751-.009 1.989 0 .194.131.42.499.349A7.25 7.25 0 0 0 7.499.25Z"
			/>
		</svg>
	);
}
