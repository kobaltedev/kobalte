export const CORE_VERSIONS = ["0.1.0", "0.2.0", "0.3.0", "0.3.1"].reverse();
export const PIGMENT_VERSIONS = ["0.1.0"].reverse();

export const LATEST_CORE_CHANGELOG_URL = `/docs/changelog/core/${CORE_VERSIONS[0].replaceAll(
  ".",
  "-"
)}`;
