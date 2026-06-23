export * from "./create-collator";
export * from "./create-date-formatter";
export * from "./create-default-locale";
export * from "./create-filter";
export * from "./create-number-formatter";
export * from "./i18n-provider";
export * from "./utils";
export {
	flatten,
	prefix,
	template,
	resolveTemplate,
	identityResolveTemplate,
	translator,
	scopedTranslator,
	chainedTranslator,
	proxyTranslator,
} from "@solid-primitives/i18n";
export type {
	BaseDict,
	BaseRecordDict,
	BaseArrayDict,
	Flatten,
	Prefixed,
	Template,
	TemplateArgs,
	BaseTemplateArgs,
	TemplateResolver,
	Translator,
	NullableTranslator,
	Resolver,
	NullableResolver,
	Scopes,
	Scoped,
	ChainedTranslator,
	NullableChainedTranslator,
} from "@solid-primitives/i18n";
