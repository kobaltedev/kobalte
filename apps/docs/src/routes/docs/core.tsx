import type { RouteProps } from "@solidjs/router";

import { Layout } from "../../components";
import type { NavSection } from "../../model/navigation";

const CORE_NAV_SECTIONS: NavSection[] = [
	{
		title: "Overview",
		links: [
			{
				title: "Introduction",
				href: "/docs/core/overview/introduction",
			},
			{
				title: "Getting started",
				href: "/docs/core/overview/getting-started",
			},
			{
				title: "Styling",
				href: "/docs/core/overview/styling",
			},
			{
				title: "Animation",
				href: "/docs/core/overview/animation",
			},
			{
				title: "Polymorphism",
				href: "/docs/core/overview/polymorphism",
				status: "updated",
			},
			{
				title: "Server side rendering",
				href: "/docs/core/overview/ssr",
			},
		],
	},
	{
		title: "Components",
		links: [
			{
				title: "Accordion",
				href: "/docs/core/components/accordion",
			},
			{
				title: "Alert",
				href: "/docs/core/components/alert",
			},
			{
				title: "Alert Dialog",
				href: "/docs/core/components/alert-dialog",
			},
			{
				title: "Breadcrumbs",
				href: "/docs/core/components/breadcrumbs",
			},
			{
				title: "Button",
				href: "/docs/core/components/button",
			},
			{
				title: "Checkbox",
				href: "/docs/core/components/checkbox",
			},
			{
				title: "Checkbox Group",
				href: "/docs/core/components/checkbox-group",
				status: "new",
			},
			{
				title: "Collapsible",
				href: "/docs/core/components/collapsible",
			},
			{
				title: "Combobox",
				href: "/docs/core/components/combobox",
			},
			{
				title: "Context Menu",
				href: "/docs/core/components/context-menu",
			},
			{
				title: "Dialog",
				href: "/docs/core/components/dialog",
			},
			{
				title: "Dropdown Menu",
				href: "/docs/core/components/dropdown-menu",
			},
			{
				title: "Hover Card",
				href: "/docs/core/components/hover-card",
			},
			{
				title: "Image",
				href: "/docs/core/components/image",
			},
			{
				title: "Link",
				href: "/docs/core/components/link",
			},
			{
				title: "Menubar",
				href: "/docs/core/components/menubar",
			},
			{
				title: "Meter",
				href: "/docs/core/components/meter",
				status: "new",
			},
			{
				title: "Navigation Menu",
				href: "/docs/core/components/navigation-menu",
				status: "new",
			},
			{
				title: "Number Field",
				href: "/docs/core/components/number-field",
			},
			{
				title: "Pagination",
				href: "/docs/core/components/pagination",
			},
			{
				title: "Popover",
				href: "/docs/core/components/popover",
			},
			{
				title: "Progress",
				href: "/docs/core/components/progress",
			},
			{
				title: "Radio Group",
				href: "/docs/core/components/radio-group",
			},
			{
				title: "Select",
				href: "/docs/core/components/select",
			},
			{
				title: "Separator",
				href: "/docs/core/components/separator",
			},
			{
				title: "Skeleton",
				href: "/docs/core/components/skeleton",
			},
			{
				title: "Slider",
				href: "/docs/core/components/slider",
			},
			{
				title: "Switch",
				href: "/docs/core/components/switch",
			},
			{
				title: "Tabs",
				href: "/docs/core/components/tabs",
			},
			{
				title: "Text Field",
				href: "/docs/core/components/text-field",
			},
			{
				title: "Toast",
				href: "/docs/core/components/toast",
			},
			{
				title: "Toggle Button",
				href: "/docs/core/components/toggle-button",
			},
			{
				title: "Toggle Group",
				href: "/docs/core/components/toggle-group",
			},
			{
				title: "Tooltip",
				href: "/docs/core/components/tooltip",
			},
			{
				title: "I18nProvider",
				href: "/docs/core/components/i18n-provider",
			},
		],
	},
];

export default function CoreLayout(props: RouteProps<string>) {
	return <Layout navSections={CORE_NAV_SECTIONS}>{props.children}</Layout>;
}
