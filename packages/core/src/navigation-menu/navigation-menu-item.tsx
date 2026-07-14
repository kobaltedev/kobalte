import type { ValidComponent } from "solid-js";
import type { PolymorphicProps } from "../polymorphic/index.tsx";

import { MenuItem, type MenuItemProps } from "../menu/menu-item.tsx";

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
