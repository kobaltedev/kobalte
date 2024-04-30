import { Image } from "@kobalte/core/image";

import style from "./image.module.css";

export function BasicExample() {
	return (
		<div class="flex items-center space-x-2">
			<Image fallbackDelay={600} class={style.image}>
				<Image.Img
					class={style.image__img}
					src="https://randomuser.me/api/portraits/women/44.jpg"
					alt="Nicole Steeves"
				/>
				<Image.Fallback class={style.image__fallback}>NS</Image.Fallback>
			</Image>
			<Image class={style.image}>
				<Image.Fallback class={style.image__fallback}>MD</Image.Fallback>
			</Image>
		</div>
	);
}
