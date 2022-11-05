import copy from "rollup-plugin-copy";
import withSolid from "rollup-preset-solid";

export default withSolid({
  input: "src/index.tsx",
  targets: ["esm", "cjs"],
  plugins: [
    copy({
      targets: [{ src: "scss", dest: "dist/scss" }],
    }),
  ],
});
