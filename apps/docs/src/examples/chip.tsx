import { Chip } from "@kobalte/core/chip";

import style from "./chip.module.css";

console.log('style', style);

export function BasicExample() {
	return (
		<div class={style.section}>
			<Chip onClick={() => console.log('onClickHandler - Chip A')} class={style.chip}>
				<Chip.Label class={style.chip__label}>Chip A</Chip.Label>
			</Chip>
			<Chip onClick={() => console.log('onClickHandler - Chip B')} class={style.chip}>
				<Chip.Label class={style.chip__label}>Chip B</Chip.Label>
			</Chip>
			<Chip onClick={() => console.log('this is a disabled chip')} class={style.chip} disabled={true}>
				<Chip.Label class={style.chip__label}>Disabled Chip C</Chip.Label>
			</Chip>
			<Chip onClick={() => console.log('delete me on click!!!')} class={style.chip__deletable}>
				<Chip.Label class={style.chip__label}>Deletable Chip D</Chip.Label>
				<span class={style.delete}>X</span>
			</Chip>
		</div>
	)
}
