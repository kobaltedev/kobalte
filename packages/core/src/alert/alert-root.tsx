import { ValidComponent } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";

export interface AlertRootOptions {}

export interface AlertRootCommonProps {}

export interface AlertRootRenderProps extends AlertRootCommonProps {
	role: "alert";
}

export type AlertRootProps = AlertRootOptions & Partial<AlertRootCommonProps>;

/**
 * Alert displays a brief, important message
 * in a way that attracts the user's attention without interrupting the user's task.
 */
export function AlertRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, AlertRootProps>,
) {
	return (
		<Polymorphic<AlertRootRenderProps>
			as="div"
			role="alert"
			{...(props as AlertRootProps)}
		/>
	);
}
