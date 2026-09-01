import { Divider } from "@kobalte/core/divider";

import style from "./divider.module.css";

export function BasicExample() {
	return (
		<div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
			<span>Content above</span>
			<Divider class={style.divider} />
			<span>Content below</span>
		</div>
	);
}

export function VerticalExample() {
	return (
		<div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
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
		<div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
			<span>Sign in with your email</span>
			<Divider class={style["divider-with-text"]}>or</Divider>
			<span>Continue as guest</span>
		</div>
	);
}
