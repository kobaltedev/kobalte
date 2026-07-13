import Layout from "@kobalte/solidbase/default-theme/Layout.jsx";
import { DefaultThemeComponentsProvider } from "@kobalte/solidbase/default-theme/context.jsx";
import type { ComponentProps } from "solid-js";

import Badges from "./components/Badges";
import Footer from "./components/Footer";
import Header from "./components/Header";

import "./theme.css";

export default function (props: ComponentProps<typeof Layout>) {
	return (
		<>
			<DefaultThemeComponentsProvider
				components={{
					Badges,
					Footer,
					Header,
				}}
				force
			>
				<Layout {...props} />
			</DefaultThemeComponentsProvider>
		</>
	);
}
