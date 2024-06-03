import { ValidComponent } from "solid-js";
import { PolymorphicProps } from "../polymorphic";

import { MenuItem, MenuItemProps } from "../menu/menu-item";

/**
 * An item of the navigation menu.
 */
export function NavigationMenuItem<T extends ValidComponent = "a">(
	props: PolymorphicProps<T, MenuItemProps<T>>,
) {
	return (
		<li role="presentation">
			<MenuItem as="a" {...props} />
		</li>
	);
}
