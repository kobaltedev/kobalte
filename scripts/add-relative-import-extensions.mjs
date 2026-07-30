// One-time codemod: add explicit file extensions to relative import/export
// specifiers so the source can be published to JSR/Deno as-is (Deno requires
// literal ".ts"/".tsx" extensions on relative specifiers; there is no
// extension-less or directory resolution). Safe to run again on new files -
// it only rewrites specifiers that don't already end in a known extension,
// and it fails loudly instead of guessing when a specifier can't be resolved
// unambiguously.
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const targets = process.argv.slice(2);
if (targets.length === 0) {
	console.error(
		"Usage: node scripts/add-relative-import-extensions.mjs <dir> [<dir> ...]",
	);
	process.exit(1);
}

const SPECIFIER_RE =
	/((?:^|\bfrom\s+|^import\s+|^export\s+\*\s+(?:as\s+\w+\s+)?from\s+)["'])(\.\.?\/[^"']+)(["'])/;
const KNOWN_EXT_RE = /\.(ts|tsx|js|jsx|mjs|cjs|json|css)$/;

let filesChanged = 0;
let specifiersChanged = 0;
const problems = [];

function listSourceFiles(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			out.push(...listSourceFiles(full));
		} else if (/\.(ts|tsx)$/.test(entry.name)) {
			out.push(full);
		}
	}
	return out;
}

function resolveSpecifier(fromFile, spec) {
	const base = path.resolve(path.dirname(fromFile), spec);
	const candidates = [
		{ file: `${base}.tsx`, isDirectoryIndex: false },
		{ file: `${base}.ts`, isDirectoryIndex: false },
		{ file: path.join(base, "index.tsx"), isDirectoryIndex: true },
		{ file: path.join(base, "index.ts"), isDirectoryIndex: true },
	];
	return candidates.find((c) => fs.existsSync(c.file)) ?? null;
}

for (const target of targets) {
	const dir = path.resolve(rootDir, target);
	for (const file of listSourceFiles(dir)) {
		const original = fs.readFileSync(file, "utf8");
		const lines = original.split("\n");
		let fileChanged = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

			const match = line.match(SPECIFIER_RE);
			if (!match) continue;

			const spec = match[2];
			if (KNOWN_EXT_RE.test(spec)) continue;

			const hit = resolveSpecifier(file, spec);
			if (!hit) {
				problems.push(
					`$path.relative(rootDir, file):$i + 1: cannot resolve "${spec}"`,
				);
				continue;
			}

			const ext = hit.file.endsWith(".tsx") ? ".tsx" : ".ts";
			const newSpec = hit.isDirectoryIndex
				? `${spec.replace(/\/$/, "")}/index${ext}`
				: `${spec}${ext}`;

			lines[i] = line.replace(
				SPECIFIER_RE,
				(_m, pre, _s, post) => `${pre}${newSpec}${post}`,
			);
			fileChanged = true;
			specifiersChanged++;
		}

		if (fileChanged) {
			fs.writeFileSync(file, lines.join("\n"));
			filesChanged++;
		}
	}
}

console.log(
	`Rewrote ${specifiersChanged} specifiers across ${filesChanged} files.`,
);
if (problems.length > 0) {
	console.error(`\n$problems.lengthunresolved specifier(s):`);
	for (const p of problems) console.error(`  ${p}`);
	process.exit(1);
}
