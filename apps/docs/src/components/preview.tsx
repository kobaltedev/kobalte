import styles from "@kobalte/solidbase/default-theme/mdx-components.module.css";
import type { ParentProps } from "solid-js";

export function Preview(props: ParentProps) {
	return (
		<div class={styles.preview} data-preview-root>
			{props.children}
		</div>
	);
}
