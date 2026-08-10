import style from "./hover-card.module.css";

import { HoverCard } from "@kobalte/core/hover-card";

export function BasicExample() {
	return (
		<HoverCard>
			<HoverCard.Trigger
				class={style.hovercard__trigger}
				href="https://github.com/kobaltedev"
				target="_blank"
			>
				@kobaltedev
			</HoverCard.Trigger>
			<HoverCard.Portal>
				<HoverCard.Content class={style.hovercard__content}>
					<HoverCard.Arrow />
					<img
						src="https://avatars.githubusercontent.com/u/124704559?s=200&v=4"
						alt="Kobalte"
						class={style.hovercard__avatar}
					/>
					<h2 class={style.hovercard__title}>Kobalte</h2>
					<p class={style.hovercard__description}>
						A UI toolkit for building accessible web apps and design systems
						with SolidJS.
					</p>
				</HoverCard.Content>
			</HoverCard.Portal>
		</HoverCard>
	);
}
