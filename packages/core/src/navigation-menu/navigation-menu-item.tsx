import type { ValidComponent } from "solid-js";
import type { PolymorphicProps } from "../polymorphic";

import { MenuItem, type MenuItemProps } from "../menu/menu-item";

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
