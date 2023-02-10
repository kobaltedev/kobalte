export const CORE_VERSIONS = [
  "0.1.0",
  "0.2.0",
  "0.3.0",
  "0.3.1",
  "0.4.0",
  "0.5.0",
  "0.6.0",
  "0.6.1",
].reverse();

export const LATEST_CORE_CHANGELOG_URL = `/docs/changelog/${CORE_VERSIONS[0].replaceAll(".", "-")}`;
