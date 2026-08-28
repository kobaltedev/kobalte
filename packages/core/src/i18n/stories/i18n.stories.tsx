import {
	flatten,
	resolveTemplate,
	scopedTranslator,
	translator,
} from "@solid-primitives/i18n";
import { createMemo, createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	createCollator,
	createDateFormatter,
	createFilter,
	createNumberFormatter,
	I18nProvider,
	useLocale,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Primitives/I18n",
	tags: ["autodocs"],
});

export default meta;

// ---------------------------------------------------------------------------
// Story: Locale Switcher
// ---------------------------------------------------------------------------

const LOCALES = [
	{ code: "en-US", name: "English (US)" },
	{ code: "ar-SA", name: "Arabic (SA)" },
	{ code: "he-IL", name: "Hebrew (IL)" },
	{ code: "fr-FR", name: "French (FR)" },
	{ code: "ja-JP", name: "Japanese (JP)" },
	{ code: "de-DE", name: "German (DE)" },
];

function LocaleDisplay() {
	const { locale, direction } = useLocale();
	return (
		<div class={style.panel}>
			<div class={style.row}>
				<span class={style.label}>Locale</span>
				<span class={style.value}>{locale()}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Direction</span>
				<span class={style.value}>{direction()}</span>
			</div>
		</div>
	);
}

/**
 * Wrap any subtree with `I18nProvider` to supply a locale. The `useLocale()`
 * hook reads the nearest provider's locale and writing direction (ltr / rtl).
 * Without a provider, it falls back to the browser's language.
 */
export const LocaleSwitcher = meta.story({
	name: "Locale Switcher",
	args: {
		locale: "en-US",
	},
	argTypes: {
		locale: {
			control: "select",
			options: LOCALES.map((l) => l.code),
			description: "BCP-47 locale tag supplied to I18nProvider.",
		},
	},
	render: (args) => (
		<I18nProvider locale={args.locale}>
			<LocaleDisplay />
		</I18nProvider>
	),
});

// ---------------------------------------------------------------------------
// Story: Number Formatter
// ---------------------------------------------------------------------------

function NumberFormatterDisplay() {
	const { locale } = useLocale();
	const currency = createNumberFormatter(() => ({
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2,
	}));
	const percent = createNumberFormatter(() => ({
		style: "percent",
		maximumFractionDigits: 1,
	}));
	const compact = createNumberFormatter(() => ({ notation: "compact" }));

	const amount = 12345.67;

	return (
		<div class={style.panel}>
			<div class={style.row}>
				<span class={style.label}>Locale</span>
				<span class={style.value}>{locale()}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Currency</span>
				<span class={style.value}>{currency().format(amount)}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Percent</span>
				<span class={style.value}>{percent().format(0.4267)}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Compact</span>
				<span class={style.value}>{compact().format(1_234_567)}</span>
			</div>
		</div>
	);
}

/**
 * `createNumberFormatter` returns a reactive `Intl.NumberFormat` that
 * automatically updates when the locale changes.
 */
export const NumberFormatter = meta.story({
	name: "Number Formatter",
	args: { locale: "en-US" },
	argTypes: {
		locale: {
			control: "select",
			options: LOCALES.map((l) => l.code),
			description: "Switch locale to see how number formatting changes.",
		},
	},
	render: (args) => (
		<I18nProvider locale={args.locale}>
			<NumberFormatterDisplay />
		</I18nProvider>
	),
});

// ---------------------------------------------------------------------------
// Story: Date Formatter
// ---------------------------------------------------------------------------

function DateFormatterDisplay() {
	const { locale } = useLocale();
	const shortDate = createDateFormatter(() => ({ dateStyle: "short" }));
	const longDate = createDateFormatter(() => ({
		dateStyle: "full",
		timeStyle: "short",
	}));
	const relative = createDateFormatter(() => ({
		year: "numeric",
		month: "long",
		day: "numeric",
	}));

	const now = new Date(2025, 5, 23);

	return (
		<div class={style.panel}>
			<div class={style.row}>
				<span class={style.label}>Locale</span>
				<span class={style.value}>{locale()}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Short date</span>
				<span class={style.value}>{shortDate().format(now)}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Full + time</span>
				<span class={style.value}>{longDate().format(now)}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Long month</span>
				<span class={style.value}>{relative().format(now)}</span>
			</div>
		</div>
	);
}

/**
 * `createDateFormatter` wraps native `Intl.DateTimeFormat` and re-creates it
 * whenever the locale or options change.
 */
export const DateFormatterStory = meta.story({
	name: "Date Formatter",
	args: { locale: "en-US" },
	argTypes: {
		locale: {
			control: "select",
			options: LOCALES.map((l) => l.code),
			description: "Switch locale to see how date formatting changes.",
		},
	},
	render: (args) => (
		<I18nProvider locale={args.locale}>
			<DateFormatterDisplay />
		</I18nProvider>
	),
});

// ---------------------------------------------------------------------------
// Story: Filter (createFilter)
// ---------------------------------------------------------------------------

const FRUITS = [
	"Apple",
	"Apricot",
	"Avocado",
	"Banana",
	"Blueberry",
	"Cherry",
	"Coconut",
	"Date",
	"Fig",
	"Grape",
	"Guava",
	"Kiwi",
	"Lemon",
	"Lime",
	"Mango",
	"Melon",
	"Orange",
	"Papaya",
	"Peach",
	"Pear",
	"Pineapple",
	"Plum",
	"Raspberry",
	"Strawberry",
	"Watermelon",
];

function FilterDisplay(props: {
	mode: "startsWith" | "endsWith" | "contains";
}) {
	const [query, setQuery] = createSignal("a");
	const filter = createFilter({ sensitivity: "base" });

	const results = createMemo(() => {
		const q = query();
		if (!q) return FRUITS;
		return FRUITS.filter((f) => filter[props.mode](f, q));
	});

	return (
		<div class={style.filterWrapper}>
			<input
				class={style.filterInput}
				placeholder="Type to filter…"
				value={query()}
				onInput={(e) => setQuery(e.currentTarget.value)}
			/>
			<div class={style.filterCount}>{results().length} matches</div>
			<div class={style.filterTags}>
				<For each={results()}>
					{(fruit) => <span class={style.filterTag}>{fruit}</span>}
				</For>
			</div>
		</div>
	);
}

/**
 * `createFilter` uses `Intl.Collator` under the hood and exposes
 * locale-aware `startsWith`, `endsWith`, and `contains` methods.
 * The `sensitivity: "base"` option makes matching case- and accent-insensitive.
 */
export const FilterStory = meta.story({
	name: "Filter",
	args: {
		mode: "startsWith" as "startsWith" | "endsWith" | "contains",
		locale: "en-US",
	},
	argTypes: {
		mode: {
			control: "select",
			options: ["startsWith", "endsWith", "contains"],
			description: "Which filter method to apply.",
		},
		locale: {
			control: "select",
			options: LOCALES.map((l) => l.code),
		},
	},
	render: (args) => (
		<I18nProvider locale={args.locale}>
			<FilterDisplay mode={args.mode} />
		</I18nProvider>
	),
});

// ---------------------------------------------------------------------------
// Story: Collator (string sorting)
// ---------------------------------------------------------------------------

const WORDS_EN = [
	"résumé",
	"Zebra",
	"apple",
	"éclair",
	"Banana",
	"café",
	"date",
];
const WORDS_DE = ["Straße", "straße", "Strasse", "strasse", "Äpfel", "apfel"];

function CollatorDisplay(props: { words: string[] }) {
	const collator = createCollator({ sensitivity: "base", caseFirst: "upper" });
	const { locale } = useLocale();

	const sorted = createMemo(() =>
		[...props.words].sort((a, b) => collator().compare(a, b)),
	);

	return (
		<div class={style.panel}>
			<div class={style.row}>
				<span class={style.label}>Locale</span>
				<span class={style.value}>{locale()}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Original</span>
				<span class={[style.value, style.valueTruncate]}>
					{props.words.join(", ")}
				</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Sorted</span>
				<span class={[style.value, style.valueTruncate]}>
					{sorted().join(", ")}
				</span>
			</div>
		</div>
	);
}

/**
 * `createCollator` caches `Intl.Collator` instances per locale+options key.
 * Locale-sensitive sorting handles accents, case, and script differences correctly.
 */
export const CollatorStory = meta.story({
	name: "Collator",
	args: {
		wordSet: "english" as "english" | "german",
		locale: "en-US",
	},
	argTypes: {
		wordSet: {
			control: "select",
			options: ["english", "german"],
			description:
				"Word list to sort — German set highlights umlaut collation.",
		},
		locale: {
			control: "select",
			options: LOCALES.map((l) => l.code),
		},
	},
	render: (args) => (
		<I18nProvider locale={args.locale}>
			<CollatorDisplay
				words={args.wordSet === "german" ? WORDS_DE : WORDS_EN}
			/>
		</I18nProvider>
	),
});

// ---------------------------------------------------------------------------
// Story: Translator (via @solid-primitives/i18n)
// ---------------------------------------------------------------------------

const enDict = flatten({
	greeting: "Hello, {{ name }}!",
	farewell: (name: string) => `Goodbye, ${name}!`,
	nav: {
		home: "Home",
		about: "About",
		contact: "Contact",
	},
	items: (count: number) => (count === 1 ? "1 item" : `${count} items`),
});

const frDict = flatten({
	greeting: "Bonjour, {{ name }} !",
	farewell: (name: string) => `Au revoir, ${name} !`,
	nav: {
		home: "Accueil",
		about: "À propos",
		contact: "Contact",
	},
	items: (count: number) => (count === 1 ? "1 élément" : `${count} éléments`),
});

const deDict = flatten({
	greeting: "Hallo, {{ name }}!",
	farewell: (name: string) => `Auf Wiedersehen, ${name}!`,
	nav: {
		home: "Startseite",
		about: "Über uns",
		contact: "Kontakt",
	},
	items: (count: number) => (count === 1 ? "1 Element" : `${count} Elemente`),
});

const DICTS = { "en-US": enDict, "fr-FR": frDict, "de-DE": deDict } as const;

type DictKey = keyof typeof DICTS;

function TranslatorDisplay(props: {
	dictKey: DictKey;
	name: string;
	count: number;
}) {
	const dict = createMemo(() => DICTS[props.dictKey] ?? enDict);
	const t = translator(dict, resolveTemplate);
	const nav = scopedTranslator(t, "nav");

	return (
		<div class={style.panel}>
			<div class={style.row}>
				<span class={style.label}>Greeting</span>
				<span class={style.value}>{t("greeting", { name: props.name })}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Farewell</span>
				<span class={style.value}>{t("farewell", props.name)}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>Items</span>
				<span class={style.value}>{t("items", props.count)}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>nav.home</span>
				<span class={style.value}>{nav("home")}</span>
			</div>
			<div class={style.row}>
				<span class={style.label}>nav.about</span>
				<span class={style.value}>{nav("about")}</span>
			</div>
		</div>
	);
}

/**
 * `translator` from `@solid-primitives/i18n` creates a reactive lookup function.
 * Pass a signal/accessor returning the flattened dictionary and an optional
 * `resolveTemplate` function to handle `{{ placeholder }}` substitutions.
 * `scopedTranslator` narrows the translator to a key prefix.
 */
export const TranslatorStory = meta.story({
	name: "Translator",
	args: {
		locale: "en-US" as DictKey,
		name: "Alice",
		count: 3,
	},
	argTypes: {
		locale: {
			control: "select",
			options: Object.keys(DICTS),
			description: "Switch dictionary language.",
		},
		name: {
			control: "text",
			description: "Name interpolated into greeting and farewell.",
		},
		count: {
			control: { type: "number", min: 0, max: 100 },
			description: "Item count — exercises pluralisation function.",
		},
	},
	render: (args) => (
		<TranslatorDisplay
			dictKey={args.locale}
			name={args.name}
			count={args.count}
		/>
	),
});
