import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

addons.setConfig({
	theme: create({
		base: "dark",
		brandTitle: "Kobalte",
		brandImage: "/kobalte.svg",
		brandUrl: "https://kobalte.dev",
		brandTarget: "_blank",
	}),
});
