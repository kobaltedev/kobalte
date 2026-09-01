import {
	type CardContentCommonProps,
	type CardContentOptions,
	type CardContentProps,
	type CardContentRenderProps,
	CardContent as Content,
} from "./card-content";
import {
	type CardDescriptionCommonProps,
	type CardDescriptionOptions,
	type CardDescriptionProps,
	type CardDescriptionRenderProps,
	CardDescription as Description,
} from "./card-description";
import {
	type CardFooterCommonProps,
	type CardFooterOptions,
	type CardFooterProps,
	type CardFooterRenderProps,
	CardFooter as Footer,
} from "./card-footer";
import {
	type CardHeaderCommonProps,
	type CardHeaderOptions,
	type CardHeaderProps,
	type CardHeaderRenderProps,
	CardHeader as Header,
} from "./card-header";
import {
	type CardHeaderActionCommonProps,
	type CardHeaderActionOptions,
	type CardHeaderActionProps,
	type CardHeaderActionRenderProps,
	CardHeaderAction as HeaderAction,
} from "./card-header-action";
import {
	type CardRootCommonProps,
	type CardRootOptions,
	type CardRootProps,
	type CardRootRenderProps,
	CardRoot as Root,
} from "./card-root";
import {
	type CardTitleCommonProps,
	type CardTitleOptions,
	type CardTitleProps,
	type CardTitleRenderProps,
	CardTitle as Title,
} from "./card-title";

export type {
	CardContentCommonProps,
	CardContentOptions,
	CardContentProps,
	CardContentRenderProps,
	CardDescriptionCommonProps,
	CardDescriptionOptions,
	CardDescriptionProps,
	CardDescriptionRenderProps,
	CardFooterCommonProps,
	CardFooterOptions,
	CardFooterProps,
	CardFooterRenderProps,
	CardHeaderActionCommonProps,
	CardHeaderActionOptions,
	CardHeaderActionProps,
	CardHeaderActionRenderProps,
	CardHeaderCommonProps,
	CardHeaderOptions,
	CardHeaderProps,
	CardHeaderRenderProps,
	CardRootCommonProps,
	CardRootOptions,
	CardRootProps,
	CardRootRenderProps,
	CardTitleCommonProps,
	CardTitleOptions,
	CardTitleProps,
	CardTitleRenderProps,
};

export { Content, Description, Footer, Header, HeaderAction, Root, Title };

export const Card = Object.assign(Root, {
	Content,
	Description,
	Footer,
	Header,
	HeaderAction,
	Title,
});

export { type CardContextValue, useCardContext } from "./card-context";
