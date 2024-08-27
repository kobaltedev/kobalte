export const CORE_VERSIONS = [
	"0.13.x",
	"0.12.x",
	"0.11.x",
	"0.10.x",
	"0.9.x",
	"0.8.x",
	"0.7.x",
	"0.6.x",
	"0.5.x",
	"0.4.x",
	"0.3.x",
	"0.2.x",
	"0.1.x",
];

export const LATEST_CORE_CHANGELOG_URL = `/docs/changelog/${CORE_VERSIONS[0].replaceAll(
	".",
	"-",
)}`;

export const LATEST_CORE_VERSION_NAME = "v0.13.6";
