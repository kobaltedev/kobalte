export const CORE_VERSIONS = [
  "0.1.0",
  "0.2.0",
  "0.3.0",
  "0.3.1",
  "0.4.0",
  "0.5.0",
  "0.6.0",
  "0.6.1",
  "0.6.2",
  "0.7.0",
  "0.7.1",
  "0.7.2",
  "0.7.3",
  "0.7.4",
  "0.8.0",
  "0.8.1",
  "0.8.2",
  "0.9.0",
  "0.9.1",
  "0.9.2",
  "0.9.3",
].reverse();

export const LATEST_CORE_CHANGELOG_URL = `/docs/changelog/${CORE_VERSIONS[0].replaceAll(".", "-")}`;

export const LATEST_CORE_VERSION_NAME = `v${CORE_VERSIONS[0]}`;
