/**!
 * Portions of this file are based on code from Corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the Corvu team:
 * https://github.com/corvudev/corvu
 */

/**
 * Modifies the given element's style and reverts it back to its original style callback is called.
 *
 * @param props.element - The element to modify the style of.
 * @param props.style - Styles to apply to the element.
 * @param props.properties - Properties to set on the element's style.
 */
export function createStyle(props: {
	element: HTMLElement;
	style?: Partial<CSSStyleDeclaration>;
	properties?: { key: string; value: string }[];
}) {
	const style = props.style ?? {};
	const properties = props.properties ?? [];

	const originalStyles = (
		Object.keys(style) as (keyof CSSStyleDeclaration)[]
	).map((key) => {
		return [key, props.element.style[key]];
	});

	Object.assign(props.element.style, props.style);

	for (const property of properties) {
		props.element.style.setProperty(property.key, property.value);
	}

	return () => {
		for (const originalStyle of originalStyles) {
			// @ts-expect-error: Some types of CSSStyleDeclaration can not be used as an index type and I'm not sure how to type this.
			props.element.style[originalStyle[0]] = originalStyle[1];
		}

		for (const property of properties) {
			props.element.style.removeProperty(property.key);
		}

		if (props.element.style.length === 0) {
			props.element.removeAttribute("style");
		}
	};
}
