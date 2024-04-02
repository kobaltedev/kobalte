/* @refresh reload */

import { ComponentProps, JSX, ValidComponent, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

/* -------------------------------------------------------------------------------------------------
 * Polymorphic
 * -----------------------------------------------------------------------------------------------*/

// Combine T and P by overriding T
export type OverrideProps<T, P> = Omit<T, keyof P> & P;

/**
 * Polymorphic attribute.
 */
export interface PolymorphicAttributes<T extends ValidComponent> {
	as?: T | keyof JSX.HTMLElementTags;
}

/**
 * Props used by a polymorphic component.
 */
export type PolymorphicProps<
	T extends ValidComponent,
	Props extends {} = {},
> = OverrideProps<
	ComponentProps<T>, // Override props from custom/tag component with our own
	Props & // Accept custom props of our own component
		PolymorphicAttributes<T>
>;

/**
 * Helper type to get the exact props in Polymnorphic `as` callback.
 */
export type PolymorphicCallbackProps<
	CustomProps extends {},
	BaseProps extends {},
	RenderProps extends {},
> = Omit<CustomProps, keyof BaseProps | keyof RenderProps> & RenderProps;

/**
 * A utility component that render its `as` prop.
 */
export function Polymorphic<RenderProps>(
	props: RenderProps & PolymorphicAttributes<ValidComponent>,
): JSX.Element {
	const [local, others] = splitProps(props, ["as"]);

	return (
		// @ts-ignore: Props are valid but not worth calculating
		<Dynamic component={local.as} {...others} />
	);
}
