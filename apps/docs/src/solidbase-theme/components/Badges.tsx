import DefaultBadges from "@kobalte/solidbase/default-theme/components/Badges.jsx";
import type { BadgeConfig } from "@kobalte/solidbase/default-theme/frontmatter.js";
import { useLocation } from "@solidjs/router";
import type { ParentProps } from "solid-js";

const APG_ROOT = "https://www.w3.org/WAI/ARIA/apg/patterns";

const sourcePaths: Record<string, string> = {
	"i18n-provider": "i18n",
};

// First published @kobalte/core release containing each component.
const introducedVersions: Record<string, string> = {
	accordion: "0.5.0",
	alert: "0.1.0",
	"alert-dialog": "0.8.0",
	badge: "0.13.8",
	breadcrumbs: "0.5.0",
	button: "0.1.0",
	checkbox: "0.1.0",
	collapsible: "0.5.0",
	"color-area": "0.13.9",
	"color-channel-field": "0.13.9",
	"color-field": "0.13.9",
	"color-slider": "0.13.9",
	"color-swatch": "0.13.9",
	"color-wheel": "0.13.9",
	combobox: "0.9.0",
	"context-menu": "0.1.0",
	dialog: "0.1.0",
	"dropdown-menu": "0.1.0",
	"file-field": "0.13.8",
	"hover-card": "0.1.0",
	"i18n-provider": "0.1.0",
	image: "0.5.0",
	link: "0.1.0",
	menubar: "0.12.1",
	meter: "0.13.8",
	"navigation-menu": "0.13.3",
	"number-field": "0.12.3",
	pagination: "0.10.0",
	popover: "0.1.0",
	progress: "0.5.0",
	"radio-group": "0.1.0",
	rating: "0.13.12",
	search: "0.13.9",
	"segmented-control": "0.13.10",
	select: "0.1.0",
	separator: "0.1.0",
	skeleton: "0.11.1",
	slider: "0.11.2",
	switch: "0.1.0",
	tabs: "0.1.0",
	"text-field": "0.2.0",
	"time-field": "0.13.12",
	toast: "0.8.0",
	"toggle-button": "0.1.0",
	"toggle-group": "0.13.0",
	tooltip: "0.9.0",
};

type AriaReference = { label: string } & (
	| { path: string; url?: never }
	| { path?: never; url: string }
);

const ariaReferences: Record<string, AriaReference> = {
	accordion: { label: "Accordion", path: "accordion" },
	alert: { label: "Alert", path: "alert" },
	"alert-dialog": { label: "Alert dialog", path: "alertdialog" },
	breadcrumbs: { label: "Breadcrumb", path: "breadcrumb" },
	button: { label: "Button", path: "button" },
	checkbox: { label: "Checkbox", path: "checkbox" },
	collapsible: { label: "Disclosure", path: "disclosure" },
	"color-channel-field": { label: "Spinbutton", path: "spinbutton" },
	combobox: { label: "Combobox", path: "combobox" },
	"context-menu": { label: "Menu", path: "menubar" },
	dialog: { label: "Dialog", path: "dialog-modal" },
	"dropdown-menu": { label: "Menu button", path: "menu-button" },
	link: { label: "Link", path: "link" },
	menubar: { label: "Menubar", path: "menubar" },
	meter: { label: "Meter", path: "meter" },
	"navigation-menu": { label: "Menubar", path: "menubar" },
	"number-field": { label: "Spinbutton", path: "spinbutton" },
	popover: { label: "Dialog", url: "https://w3c.github.io/aria/#dialog" },
	"radio-group": { label: "Radio group", path: "radio" },
	search: { label: "Combobox", path: "combobox" },
	"segmented-control": { label: "Radio group", path: "radio" },
	select: { label: "Listbox", path: "listbox" },
	separator: {
		label: "Separator",
		url: "https://w3c.github.io/aria/#separator",
	},
	slider: { label: "Slider", path: "slider-multithumb" },
	switch: { label: "Switch", path: "switch" },
	tabs: { label: "Tabs", path: "tabs" },
	"toggle-button": { label: "Button", path: "button" },
	tooltip: { label: "Tooltip", path: "tooltip" },
};

export default function Badges(
	props: ParentProps<{ badges?: Array<BadgeConfig> }>,
) {
	const location = useLocation();
	const component = () =>
		location.pathname.match(/\/docs\/core\/components\/([^/]+)/)?.[1];

	const badges = (): Array<BadgeConfig> => {
		const slug = component();
		if (!slug) return props.badges ?? [];
		const introducedVersion = introducedVersions[slug];

		const items: Array<BadgeConfig> = [];

		if (introducedVersion) {
			items.push({
				icon: "npm",
				label: `v${introducedVersion}`,
				url: `https://www.npmjs.com/package/@kobalte/core/v/${introducedVersion}`,
			});
		} else {
			items.push({ icon: "npm", label: "Unreleased" });
		}

		const sourcePath = sourcePaths[slug] ?? slug;
		items.push({ label: `@kobalte/core/${sourcePath}` });
		items.push({
			icon: "source",
			label: "Source",
			url: `https://github.com/kobaltedev/kobalte/tree/main/packages/core/src/${sourcePath}`,
		});

		const ariaReference = ariaReferences[slug];
		if (ariaReference) {
			items.push({
				icon: "aria",
				label: ariaReference.label,
				url: ariaReference.url ?? `${APG_ROOT}/${ariaReference.path}/`,
			});
		}

		return [...items, ...(props.badges ?? [])];
	};

	return <DefaultBadges badges={badges()}>{props.children}</DefaultBadges>;
}
