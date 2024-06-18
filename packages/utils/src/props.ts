import { type ComponentProps, type ValidComponent, mergeProps } from "solid-js";

/**
 * Allows for extending a set of props (`Source`) by an overriding set of props (`Override`),
 * ensuring that any duplicates are overridden by the overriding set of props.
 */
export type OverrideProps<Source = {}, Override = {}> = Omit<
	Source,
	keyof Override
> &
	Override;

/**
 * Allows for extending a set of `ComponentProps` by an overriding set of props,
 * ensuring that any duplicates are overridden by the overriding set of props.
 */
export type OverrideComponentProps<T extends ValidComponent, P> = OverrideProps<
	ComponentProps<T>,
	P
>;

export function mergeDefaultProps<T extends {}, D extends Partial<T>>(
	defaultProps: D,
	props: T,
): OverrideProps<T, D> {
	return mergeProps(defaultProps, props) as OverrideProps<T, D>;
}
