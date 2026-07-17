// Keeps each JSR package's deno.jsonc "version" in sync with its package.json
// "version" (the source of truth, bumped by Changesets), and regenerates
// @kobalte/core's deno.jsonc "exports" map from its src/ layout so JSR always
// sees the same public subpaths as the tsup build (packages/core/tsup.config.ts
// entry glob: src/index.tsx, src/*/index.tsx, src/primitives/*/index.ts).
//
// Usage:
//   node scripts/sync-jsr.mjs          # write the fix
//   node scripts/sync-jsr.mjs --check  # exit 1 if anything is out of sync, don't write
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const check = process.argv.includes("--check");
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");

const JSR_PACKAGES = ["core", "utils", "tailwindcss", "vanilla-extract"];

let mismatches = 0;

function readJson(file) {
	return JSON.parse(fs.readFileSync(file, "utf8"));
}

function isDirectory(p) {
	return fs.existsSync(p) && fs.statSync(p).isDirectory();
}

function coreExports() {
	const srcDir = path.join(packagesDir, "core", "src");
	const exports = { ".": "./src/index.tsx" };

	for (const name of fs.readdirSync(srcDir).sort()) {
		const dir = path.join(srcDir, name);
		if (!isDirectory(dir)) continue;

		if (fs.existsSync(path.join(dir, "index.tsx"))) {
			exports[`./${name}`] = `./src/${name}/index.tsx`;
		}

		if (name === "primitives") {
			for (const sub of fs.readdirSync(dir).sort()) {
				const subDir = path.join(dir, sub);
				if (!isDirectory(subDir)) continue;
				if (fs.existsSync(path.join(subDir, "index.ts"))) {
					exports[`./primitives/${sub}`] = `./src/primitives/${sub}/index.ts`;
				}
			}
		}
	}

	return exports;
}

function syncPackage(name, deriveExports) {
	const dir = path.join(packagesDir, name);
	const denoPath = path.join(dir, "deno.jsonc");
	const pkgPath = path.join(dir, "package.json");
	if (!fs.existsSync(denoPath) || !fs.existsSync(pkgPath)) return;

	const pkg = readJson(pkgPath);
	const deno = readJson(denoPath);
	let changed = false;

	if (deno.version !== pkg.version) {
		console.log(`${name}: version ${deno.version} -> ${pkg.version}`);
		deno.version = pkg.version;
		changed = true;
	}

	if (deriveExports) {
		const nextExports = deriveExports();
		if (JSON.stringify(deno.exports) !== JSON.stringify(nextExports)) {
			console.log(`${name}: exports map out of date`);
			deno.exports = nextExports;
			changed = true;
		}
	}

	if (!changed) return;

	mismatches++;
	if (!check) {
		fs.writeFileSync(denoPath, `${JSON.stringify(deno, null, "\t")}\n`);
	}
}

for (const name of JSR_PACKAGES) {
	syncPackage(name, name === "core" ? coreExports : undefined);
}

if (mismatches === 0) {
	console.log("All deno.jsonc files are in sync.");
} else if (check) {
	console.error(
		`\n${mismatches} package(s) have a deno.jsonc out of sync with package.json/src. Run 'pnpm jsr:sync' to fix.`,
	);
	process.exit(1);
}
