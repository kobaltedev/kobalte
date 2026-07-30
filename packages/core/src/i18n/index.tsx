export type {
	BaseArrayDict,
	BaseDict,
	BaseRecordDict,
	BaseTemplateArgs,
	ChainedTranslator,
	Flatten,
	NullableChainedTranslator,
	NullableResolver,
	NullableTranslator,
	Prefixed,
	Resolver,
	Scoped,
	Scopes,
	Template,
	TemplateArgs,
	TemplateResolver,
	Translator,
} from "@solid-primitives/i18n";
export {
	chainedTranslator,
	flatten,
	identityResolveTemplate,
	prefix,
	proxyTranslator,
	resolveTemplate,
	scopedTranslator,
	template,
	translator,
} from "@solid-primitives/i18n";
export * from "./create-collator.ts";
export * from "./create-date-formatter.ts";
export * from "./create-default-locale.ts";
export * from "./create-filter.ts";
export * from "./create-number-formatter.ts";
export * from "./i18n-provider.tsx";
export * from "./utils.ts";
