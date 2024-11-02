import { Meter } from "@kobalte/core/meter";

import style from "./meter.module.css";

export function BasicExample() {
	return (
		<Meter value={80} class={style.meter}>
			<div class={style["meter__label-container"]}>
				<Meter.Label class={style.meter__label}>Batter Level:</Meter.Label>
				<Meter.ValueLabel class={style["meter__value-label"]} />
			</div>
			<Meter.Track class={style.meter__track}>
				<Meter.Fill class={style.meter__fill} />
			</Meter.Track>
		</Meter>
	);
}

export function CustomValueScaleExample() {
	return (
		<Meter value={100} minValue={0} maxValue={250} class={style.meter}>
			<div class={style["meter__label-container"]}>
				<Meter.Label class={style.meter__label}>Disk Space Usage:</Meter.Label>
				<Meter.ValueLabel class={style["meter__value-label"]} />
			</div>
			<Meter.Track class={style.meter__track}>
				<Meter.Fill class={style.meter__fill} />
			</Meter.Track>
		</Meter>
	);
}

export function CustomValueLabelExample() {
	return (
		<Meter
			value={3}
			minValue={0}
			maxValue={10}
			getValueLabel={({ value, max }) => `${value} of ${max} tasks completed`}
			class={style.meter}
		>
			<div class={style["meter__label-container"]}>
				<Meter.Label class={style.meter__label}>Processing...</Meter.Label>
				<Meter.ValueLabel class={style["meter__value-label"]} />
			</div>
			<Meter.Track class={style.meter__track}>
				<Meter.Fill class={style.meter__fill} />
			</Meter.Track>
		</Meter>
	);
}
