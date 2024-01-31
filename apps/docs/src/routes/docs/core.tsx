import { RouteProps } from "@solidjs/router";

import { Layout } from "../../components";
import { NavSection } from "../../model/navigation";

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
				status: "updated",
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
				status: "updated",
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
				title: "Collapsible",
				href: "/docs/core/components/collapsible",
			},
			{
				title: "Combobox",
				href: "/docs/core/components/combobox",
				status: "updated",
			},
			{
				title: "Context Menu",
				href: "/docs/core/components/context-menu",
			},
			{
				title: "Dialog",
				href: "/docs/core/components/dialog",
				status: "updated",
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
				status: "new",
			},
			{
				title: "Pagination",
				href: "/docs/core/components/pagination",
			},
			{
				title: "Popover",
				href: "/docs/core/components/popover",
				status: "updated",
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
				status: "updated",
			},
			{
				title: "Toggle Button",
				href: "/docs/core/components/toggle-button",
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
