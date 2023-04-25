import withSolid from "rollup-preset-solid";
import ts from "rollup-plugin-ts";

export default withSolid({
	input: "src/index.tsx",
	targets: ["esm", "cjs"],
	plugins: [ts()],
});
