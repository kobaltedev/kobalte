import MiniSearch from "minisearch";
import { createSignal } from "solid-js";
import { MagnifyingGlassIcon, ReloadIcon } from "../components";
import style from "./search.module.css";

type EmojiDatum = {
	emoji: string;
	name: string;
	id?: number;
};

const RAW_EMOJI_DATA: EmojiDatum[] = ([] as any)
	.concat(
		...Object.values({
			"face-smiling": [
				{
					emoji: "😀",
					name: "grinning face",
				},
				{
					emoji: "😃",
					name: "grinning face with big eyes",
				},
				{
					emoji: "😄",
					name: "grinning face with smiling eyes",
				},
				{
					emoji: "😁",
					name: "beaming face with smiling eyes",
				},
				{
					emoji: "😆",
					name: "grinning squinting face",
				},
				{
					emoji: "😅",
					name: "grinning face with sweat",
				},
				{
					emoji: "🤣",
					name: "rolling on the floor laughing",
				},
				{
					emoji: "😂",
					name: "face with tears of joy",
				},
				{
					emoji: "🙂",
					name: "slightly smiling face",
				},
				{
					emoji: "🙃",
					name: "upside-down face",
				},
				{
					emoji: "🫠",
					name: "melting face",
				},
				{
					emoji: "😉",
					name: "winking face",
				},
				{
					emoji: "😊",
					name: "smiling face with smiling eyes",
				},
				{
					emoji: "😇",
					name: "smiling face with halo",
				},
			],
			"face-affection": [
				{
					emoji: "🥰",
					name: "smiling face with hearts",
				},
				{
					emoji: "😍",
					name: "smiling face with heart-eyes",
				},
				{
					emoji: "🤩",
					name: "star-struck",
				},
				{
					emoji: "😘",
					name: "face blowing a kiss",
				},
				{
					emoji: "😗",
					name: "kissing face",
				},
				{
					emoji: "😚",
					name: "kissing face with closed eyes",
				},
				{
					emoji: "😙",
					name: "kissing face with smiling eyes",
				},
				{
					emoji: "🥲",
					name: "smiling face with tear",
				},
			],
			"face-tongue": [
				{
					emoji: "😋",
					name: "face savoring food",
				},
				{
					emoji: "😛",
					name: "face with tongue",
				},
				{
					emoji: "😜",
					name: "winking face with tongue",
				},
				{
					emoji: "🤪",
					name: "zany face",
				},
				{
					emoji: "😝",
					name: "squinting face with tongue",
				},
				{
					emoji: "🤑",
					name: "money-mouth face",
				},
			],
			"face-hand": [
				{
					emoji: "🤗",
					name: "smiling face with open hands",
				},
				{
					emoji: "🤭",
					name: "face with hand over mouth",
				},
				{
					emoji: "🫢",
					name: "face with open eyes and hand over mouth",
				},
				{
					emoji: "🫣",
					name: "face with peeking eye",
				},
				{
					emoji: "🤫",
					name: "shushing face",
				},
				{
					emoji: "🤔",
					name: "thinking face",
				},
			],
			"face-neutral-skeptical": [
				{
					emoji: "🤐",
					name: "zipper-mouth face",
				},
				{
					emoji: "🤨",
					name: "face with raised eyebrow",
				},
				{
					emoji: "😐",
					name: "neutral face",
				},
				{
					emoji: "😑",
					name: "expressionless face",
				},
				{
					emoji: "😶",
					name: "face without mouth",
				},
				{
					emoji: "😶‍🌫️",
					name: "face in clouds",
				},
				{
					emoji: "😏",
					name: "smirking face",
				},
				{
					emoji: "😒",
					name: "unamused face",
				},
				{
					emoji: "🙄",
					name: "face with rolling eyes",
				},
				{
					emoji: "😬",
					name: "grimacing face",
				},
				{
					emoji: "😮‍💨",
					name: "face exhaling",
				},
				{
					emoji: "🤥",
					name: "lying face",
				},
				{
					emoji: "🫨",
					name: "shaking face",
				},
			],
			"face-sleepy": [
				{
					emoji: "😌",
					name: "relieved face",
				},
				{
					emoji: "😔",
					name: "pensive face",
				},
				{
					emoji: "😪",
					name: "sleepy face",
				},
				{
					emoji: "🤤",
					name: "drooling face",
				},
				{
					emoji: "😴",
					name: "sleeping face",
				},
			],
			"face-unwell": [
				{
					emoji: "😷",
					name: "face with medical mask",
				},
				{
					emoji: "🤒",
					name: "face with thermometer",
				},
				{
					emoji: "🤕",
					name: "face with head-bandage",
				},
				{
					emoji: "🤢",
					name: "nauseated face",
				},
				{
					emoji: "🤮",
					name: "face vomiting",
				},
				{
					emoji: "🤧",
					name: "sneezing face",
				},
				{
					emoji: "🥵",
					name: "hot face",
				},
				{
					emoji: "🥶",
					name: "cold face",
				},
				{
					emoji: "🥴",
					name: "woozy face",
				},
				{
					emoji: "😵",
					name: "face with crossed-out eyes",
				},
				{
					emoji: "😵‍💫",
					name: "face with spiral eyes",
				},
				{
					emoji: "🤯",
					name: "exploding head",
				},
			],
			"face-hat": [
				{
					emoji: "🤠",
					name: "cowboy hat face",
				},
				{
					emoji: "🥳",
					name: "partying face",
				},
				{
					emoji: "🥸",
					name: "disguised face",
				},
			],
			"face-glasses": [
				{
					emoji: "😎",
					name: "smiling face with sunglasses",
				},
				{
					emoji: "🤓",
					name: "nerd face",
				},
				{
					emoji: "🧐",
					name: "face with monocle",
				},
			],
			"face-concerned": [
				{
					emoji: "😕",
					name: "confused face",
				},
				{
					emoji: "🫤",
					name: "face with diagonal mouth",
				},
				{
					emoji: "😟",
					name: "worried face",
				},
				{
					emoji: "🙁",
					name: "slightly frowning face",
				},
				{
					emoji: "😮",
					name: "face with open mouth",
				},
				{
					emoji: "😯",
					name: "hushed face",
				},
				{
					emoji: "😲",
					name: "astonished face",
				},
				{
					emoji: "😳",
					name: "flushed face",
				},
				{
					emoji: "🥺",
					name: "pleading face",
				},
				{
					emoji: "🥹",
					name: "face holding back tears",
				},
				{
					emoji: "😦",
					name: "frowning face with open mouth",
				},
				{
					emoji: "😧",
					name: "anguished face",
				},
				{
					emoji: "😨",
					name: "fearful face",
				},
				{
					emoji: "😰",
					name: "anxious face with sweat",
				},
				{
					emoji: "😥",
					name: "sad but relieved face",
				},
				{
					emoji: "😢",
					name: "crying face",
				},
				{
					emoji: "😭",
					name: "loudly crying face",
				},
				{
					emoji: "😱",
					name: "face screaming in fear",
				},
				{
					emoji: "😖",
					name: "confounded face",
				},
				{
					emoji: "😣",
					name: "persevering face",
				},
				{
					emoji: "😞",
					name: "disappointed face",
				},
				{
					emoji: "😓",
					name: "downcast face with sweat",
				},
				{
					emoji: "😩",
					name: "weary face",
				},
				{
					emoji: "😫",
					name: "tired face",
				},
				{
					emoji: "🥱",
					name: "yawning face",
				},
			],
			"face-negative": [
				{
					emoji: "😤",
					name: "face with steam from nose",
				},
				{
					emoji: "😡",
					name: "enraged face",
				},
				{
					emoji: "😠",
					name: "angry face",
				},
				{
					emoji: "🤬",
					name: "face with symbols on mouth",
				},
				{
					emoji: "😈",
					name: "smiling face with horns",
				},
				{
					emoji: "👿",
					name: "angry face with horns",
				},
				{
					emoji: "💀",
					name: "skull",
				},
			],
			"face-costume": [
				{
					emoji: "💩",
					name: "pile of poo",
				},
				{
					emoji: "🤡",
					name: "clown face",
				},
				{
					emoji: "👹",
					name: "ogre",
				},
				{
					emoji: "👺",
					name: "goblin",
				},
				{
					emoji: "👻",
					name: "ghost",
				},
				{
					emoji: "👽",
					name: "alien",
				},
				{
					emoji: "👾",
					name: "alien monster",
				},
				{
					emoji: "🤖",
					name: "robot",
				},
			],
			"cat-face": [
				{
					emoji: "😺",
					name: "grinning cat",
				},
				{
					emoji: "😸",
					name: "grinning cat with smiling eyes",
				},
				{
					emoji: "😹",
					name: "cat with tears of joy",
				},
				{
					emoji: "😻",
					name: "smiling cat with heart-eyes",
				},
				{
					emoji: "😼",
					name: "cat with wry smile",
				},
				{
					emoji: "😽",
					name: "kissing cat",
				},
				{
					emoji: "🙀",
					name: "weary cat",
				},
				{
					emoji: "😿",
					name: "crying cat",
				},
				{
					emoji: "😾",
					name: "pouting cat",
				},
			],
			"monkey-face": [
				{
					emoji: "🙈",
					name: "see-no-evil monkey",
				},
				{
					emoji: "🙉",
					name: "hear-no-evil monkey",
				},
				{
					emoji: "🙊",
					name: "speak-no-evil monkey",
				},
			],
		}),
	)
	.map((datum: EmojiDatum, id: number) => {
		return { ...datum, id };
	});

/** Initialise search engine */
const minisearch = new MiniSearch({
	fields: ["name"],
	storeFields: ["name", "emoji"],
	tokenize: (string: string, _fieldName: string | undefined) =>
		string.split(" "),
});
minisearch.addAll(RAW_EMOJI_DATA);

const queryEmojiData = (query: string, numSuggestions = 20) => {
	return minisearch
		.search(query, { fuzzy: 0.5, combineWith: "OR" })
		.slice(0, numSuggestions) as never as EmojiDatum[];
};

import { Search } from "@kobalte/core/search";

export function BasicExample() {
	const [options, setOptions] = createSignal<EmojiDatum[]>([]);
	const [emoji, setEmoji] = createSignal<EmojiDatum | null>();
	return (
		<>
			<Search
				triggerMode="focus"
				options={options()}
				onInputChange={(query: string) => {
					setOptions(queryEmojiData(query));
				}}
				onChange={(result: EmojiDatum | null) => setEmoji(result)}
				optionValue="name"
				optionLabel="name"
				placeholder="Search an emoji…"
				itemComponent={(props: any) => (
					<Search.Item item={props.item} class={style.search__item}>
						<Search.ItemLabel>{props.item.rawValue.emoji}</Search.ItemLabel>
					</Search.Item>
				)}
			>
				<Search.Control class={style.search__control} aria-label="Emoji">
					<Search.Indicator class={style.search__indicator}>
						<Search.Icon class={style.search__icon}>
							<MagnifyingGlassIcon class={style.center__icon} />
						</Search.Icon>
					</Search.Indicator>
					<Search.Input class={style.search__input} />
				</Search.Control>

				<Search.Portal>
					<Search.Content
						class={style.search__content}
						onCloseAutoFocus={(e) => e.preventDefault()}
					>
						<Search.Listbox class={style.search__listbox} />
						<Search.NoResult class={style.search__no_result}>
							😬 No emoji found
						</Search.NoResult>
					</Search.Content>
				</Search.Portal>
			</Search>

			<div class={style.result__content}>
				Emoji selected: {emoji()?.emoji} {emoji()?.name}
			</div>
		</>
	);
}

export function DebounceExample() {
	const [options, setOptions] = createSignal<EmojiDatum[]>([]);
	const [emoji, setEmoji] = createSignal<EmojiDatum | null>();
	return (
		<>
			<Search
				triggerMode="focus"
				options={options()}
				onInputChange={(query: string) => {
					setOptions(queryEmojiData(query));
				}}
				onChange={(result: EmojiDatum | null) => setEmoji(result)}
				debounceOptionsMillisecond={300}
				optionValue="name"
				optionLabel="name"
				placeholder="Search an emoji…"
				itemComponent={(props: any) => (
					<Search.Item item={props.item} class={style.search__item}>
						<Search.ItemLabel>{props.item.rawValue.emoji}</Search.ItemLabel>
					</Search.Item>
				)}
			>
				<Search.Control class={style.search__control} aria-label="Emoji">
					<Search.Indicator
						class={style.search__indicator}
						loadingComponent={
							<Search.Icon class={style.load__icon}>
								<ReloadIcon class={style.spin__icon} />
							</Search.Icon>
						}
					>
						<Search.Icon class={style.search__icon}>
							<MagnifyingGlassIcon class={style.center__icon} />
						</Search.Icon>
					</Search.Indicator>

					<Search.Input class={style.search__input} />
				</Search.Control>

				<Search.Portal>
					<Search.Content
						class={style.search__content}
						onCloseAutoFocus={(e) => e.preventDefault()}
					>
						<Search.Listbox class={style.search__listbox} />

						<Search.NoResult class={style.search__no_result}>
							😬 No emoji found
						</Search.NoResult>
					</Search.Content>
				</Search.Portal>
			</Search>

			<div class={style.result__content}>
				Emoji selected: {emoji()?.emoji} {emoji()?.name}
			</div>
		</>
	);
}

export function InlineStyleExample() {
	const [options, setOptions] = createSignal<EmojiDatum[]>([]);
	const [emoji, setEmoji] = createSignal<EmojiDatum | null>();
	return (
		<>
			<Search
				open
				options={options()}
				onInputChange={(query: string) => {
					setOptions(queryEmojiData(query));
				}}
				onChange={(result: EmojiDatum | null) => setEmoji(result)}
				optionValue="name"
				optionLabel="name"
				placeholder="Search an emoji…"
				itemComponent={(props: any) => (
					<Search.Item as="button" item={props.item} class={style.search__item}>
						<Search.ItemLabel>{props.item.rawValue.emoji}</Search.ItemLabel>
					</Search.Item>
				)}
				class={style.search__root_inline}
			>
				<Search.Control class={style.search__control_inline} aria-label="Emoji">
					<Search.Indicator class={style.search__indicator}>
						<Search.Icon class={style.search__icon}>
							<MagnifyingGlassIcon class={style.center__icon} />
						</Search.Icon>
					</Search.Indicator>

					<Search.Input class={style.search__input} />
				</Search.Control>
				<div class={style.search__content_inline}>
					<Search.Listbox class={style.search__listbox} />
					<Search.NoResult class={style.search__no_result_inline}>
						😬 No emoji found
					</Search.NoResult>
				</div>
			</Search>

			<div class={style.result__content}>
				Emoji selected: {emoji()?.emoji} {emoji()?.name}
			</div>
		</>
	);
}
