import { Divider } from "@kobalte/core/divider";

import style from "./divider.module.css";

export function BasicExample() {
	return (
		<div class="flex flex-col space-y-2">
			<span>Content above</span>
			<Divider class={style.divider} />
			<span>Content below</span>
		</div>
	);
}

export function VerticalExample() {
	return (
		<div class="flex items-center space-x-2">
			<span>Home</span>
			<Divider orientation="vertical" class={style.divider} />
			<span>About</span>
			<Divider orientation="vertical" class={style.divider} />
			<span>Contact</span>
		</div>
	);
}

export function WithTextExample() {
	return (
		<div class="flex flex-col space-y-2">
			<span>Sign in with your email</span>
			<Divider class={style["divider-with-text"]}>or</Divider>
			<span>Continue as guest</span>
		</div>
	);
}
