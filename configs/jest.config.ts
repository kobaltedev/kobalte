import type { Config } from "@jest/types";

const projectRootPath = "<rootDir>/../..";
const solidjsPath = `${projectRootPath}/node_modules/solid-js`;

const config: Config.InitialOptions = {
  preset: "ts-jest",

  globals: {
    "ts-jest": {
      tsconfig: `<rootDir>/tsconfig.json`,
      babelConfig: {
        presets: ["@babel/preset-env", "babel-preset-solid"],
      },
    },
  },

  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["@testing-library/jest-dom", "regenerator-runtime"],

  moduleNameMapper: {
    "solid-js/web": `${solidjsPath}/web/dist/web.cjs`,
    "solid-js/store": `${solidjsPath}/store/dist/store.cjs`,
    "solid-js": `${solidjsPath}/dist/solid.cjs`,
  },

  testPathIgnorePatterns: ["/node_modules/"],

  verbose: true,
};

export default config;
