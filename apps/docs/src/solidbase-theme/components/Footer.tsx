import type { ParentProps } from "solid-js";
import IconDiscordFill from "~icons/ri/discord-fill";
import IconGithubFill from "~icons/ri/github-fill";
import IconOpenSourceFill from "~icons/ri/open-source-fill";

import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer class={styles.footer}>
			<div class={styles.content}>
				<div>
					<a class={styles.brand} href="/">
						Kobalte<span>.</span>
					</a>
					<p>
						Made with passion by{" "}
						<a
							href="https://github.com/kobaltedev/kobalte/graphs/contributors"
							target="_blank"
							rel="noreferrer"
						>
							contributors
						</a>
						.
					</p>
				</div>
				<div class={styles.community}>
					<span>Community</span>
					<div>
						<SocialLink
							label="GitHub"
							href="https://github.com/kobaltedev/kobalte"
						>
							<IconGithubFill />
						</SocialLink>
						<SocialLink
							label="Open Collective"
							href="https://opencollective.com/kobalte"
						>
							<IconOpenSourceFill />
						</SocialLink>
						<SocialLink
							label="Discord"
							href="https://discord.com/invite/solidjs"
						>
							<IconDiscordFill />
						</SocialLink>
					</div>
				</div>
			</div>
			<a
				class={styles.netlify}
				href="https://www.netlify.com"
				target="_blank"
				rel="noreferrer"
			>
				This site is powered by Netlify.
			</a>
		</footer>
	);
}

function SocialLink(props: ParentProps<{ label: string; href: string }>) {
	return (
		<a
			aria-label={props.label}
			href={props.href}
			target="_blank"
			rel="noopener noreferrer"
		>
			{props.children}
		</a>
	);
}
