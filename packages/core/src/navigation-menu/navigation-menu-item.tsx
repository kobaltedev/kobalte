import type { ValidComponent } from "@solidjs/web";
import { MenuItem, type MenuItemProps } from "../menu/menu-item";
import type { PolymorphicProps } from "../polymorphic";

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
