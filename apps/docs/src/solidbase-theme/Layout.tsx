import Layout from "@kobalte/solidbase/default-theme/Layout.jsx";
import { DefaultThemeComponentsProvider } from "@kobalte/solidbase/default-theme/context.jsx";
import type { ComponentProps } from "solid-js";
import Footer from "@kobalte/solidbase/default-theme/components/Footer.jsx";

import styles from "./Layout.module.css";

export default function (props: ComponentProps<typeof Layout>) {

	return (
		<>
			<DefaultThemeComponentsProvider components={{
				Footer: (props) => <Footer {...props}>
					<div class={styles.footer}>
						<a
							href="https://www.netlify.com"
							target="_blank"
							rel="noreferrer"
						>
							Powered by Netlify
						</a>
						<a href="https://solidbase.dev"
						target="_blank"
						rel="noreferrer">Built with SolidBase</a>
					</div>
				</Footer>,
			}} force>
				<Layout {...props} />
			</DefaultThemeComponentsProvider>
		</>
	);
}
