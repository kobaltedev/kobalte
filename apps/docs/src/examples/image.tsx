import style from "./image.module.css";

import { Image } from "@kobalte/core/image";

export function BasicExample() {
	return (
		<div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
			<Image fallbackDelay={600} class={style.image}>
				<Image.Img
					class={style.image__img}
					src="https://avatars.githubusercontent.com/u/124704559?s=200&v=4"
					alt="Kobalte"
				/>
				<Image.Fallback class={style.image__fallback}>KB</Image.Fallback>
			</Image>
			<Image class={style.image}>
				<Image.Fallback class={style.image__fallback}>J</Image.Fallback>
			</Image>
		</div>
	);
}
