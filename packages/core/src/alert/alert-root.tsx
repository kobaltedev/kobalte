import type { ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface AlertRootOptions {}

export interface AlertRootCommonProps<T extends HTMLElement = HTMLElement> {}

export interface AlertRootRenderProps extends AlertRootCommonProps {
	role: "alert";
}

export type AlertRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = AlertRootOptions & Partial<AlertRootCommonProps<ElementOf<T>>>;

/**
 * Alert displays a brief, important message
 * in a way that attracts the user's attention without interrupting the user's task.
 */
export function AlertRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, AlertRootProps<T>>,
) {
	return (
		<Polymorphic<AlertRootRenderProps>
			as="div"
			role="alert"
			{...(props as AlertRootProps)}
		/>
	);
}
