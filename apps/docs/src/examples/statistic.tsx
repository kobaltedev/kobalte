import { Statistic } from "@kobalte/core/statistic";
import { createSignal } from "solid-js";

import style from "./statistic.module.css";

export function BasicExample() {
	return (
		<Statistic>
			<Statistic.Label class={style.label}>Web traffic</Statistic.Label>
			<Statistic.Value
				class={style.value}
				value={255650}
				formatOptions={{ notation: "compact" }}
			/>
		</Statistic>
	);
}

export function WithDescriptionExample() {
	return (
		<Statistic>
			<Statistic.Label class={style.label}>Security insights</Statistic.Label>
			<Statistic.Value class={style.value} value={40} />
			<Statistic.Description class={style.description}>
				12 high, 28 low
			</Statistic.Description>
		</Statistic>
	);
}

export function WithTrendExample() {
	return (
		<Statistic>
			<Statistic.Label class={style.label}>Cache rate</Statistic.Label>
			<Statistic.Value
				class={style.value}
				value={0.162}
				formatOptions={{ style: "percent", maximumFractionDigits: 1 }}
			/>
			<Statistic.Trend
				value={-0.025}
				formatOptions={{ style: "percent", maximumFractionDigits: 1 }}
				class={style["trend--decrease"]}
			>
				▼ 2.5%
			</Statistic.Trend>
		</Statistic>
	);
}

export function LiveUpdatingExample() {
	const [value, setValue] = createSignal(805);

	const bump = () => setValue((v) => v + Math.round(Math.random() * 20 - 10));

	return (
		<div class={style.row}>
			<Statistic>
				<Statistic.Label class={style.label}>
					Workers invocations
				</Statistic.Label>
				<Statistic.Value class={style.value} value={value()} />
			</Statistic>
			<button type="button" class={style.button} onClick={bump}>
				Simulate update
			</button>
		</div>
	);
}
