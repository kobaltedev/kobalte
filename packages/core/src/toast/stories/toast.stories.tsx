import { Portal } from "@solidjs/web";
import type { JSX } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import toastStyle from "../../../../../apps/docs/src/examples/toast.module.css";
import {
	BasicExample,
	MultipleRegionsExample,
} from "../../../../../apps/docs/src/examples/toast.tsx";
import { Toast } from "../index.tsx";

function ToastRegions(props: { children: JSX.Element }) {
	return (
		<>
			<Portal>
				<Toast.Region>
					<Toast.List class={toastStyle.toast__list} />
				</Toast.Region>
			</Portal>
			<Portal>
				<Toast.Region regionId="custom-region-id">
					<Toast.List class={toastStyle["toast__list-custom-region"]} />
				</Toast.Region>
			</Portal>
			{props.children}
		</>
	);
}

const meta = preview.meta({
	title: "Components/Toast",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => (
		<ToastRegions>
			<BasicExample />
		</ToastRegions>
	),
});

/** Multiple Regions example. */
export const MultipleRegions = meta.story({
	name: "Multiple Regions",
	render: () => (
		<ToastRegions>
			<MultipleRegionsExample />
		</ToastRegions>
	),
});
