import { IconButton } from "@kobalte/core";
import { Title as MetaTitle } from "@solidjs/meta";
import { Link, LinkProps } from "@solidjs/router";
import { ComponentProps, createMemo, createSignal, Show, splitProps } from "solid-js";

import { CheckIcon, CopyIcon } from "./components/icons";

const H1 = hope("h1", {
  baseStyle: {
    color: "neutral.800",
    fontFamily: "display",
    fontSize: "4xl",
    fontWeight: "medium",
    lineHeight: 10,
    letterSpacing: "tight",
    mt: 1,
    scrollMarginTop: "150px", // header height x1.5
    mb: 8,
    _dark: {
      color: "neutral.200",
    },
  },
});

const H2 = hope("h2", ({ vars }) => ({
  baseStyle: {
    color: "neutral.800",
    fontFamily: "display",
    fontSize: "3xl",
    fontWeight: "medium",
    lineHeight: 9,
    mt: 10,
    scrollMarginTop: "150px", // header height x1.5
    pb: 1,
    borderBottom: `1px solid ${vars.colors.neutral["200"]}`,
    _dark: {
      color: "neutral.200",
      borderBottomColor: "neutral.800",
    },
  },
}));

const H3 = hope("h3", {
  baseStyle: {
    color: "neutral.800",
    fontFamily: "display",
    fontSize: "2xl",
    fontWeight: "medium",
    lineHeight: 8,
    mt: 8,
    scrollMarginTop: "150px", // header height x1.5
    _dark: {
      color: "neutral.200",
    },
  },
});

const P = hope("p", {
  baseStyle: {
    _notFirst: {
      mt: 6,

      "p + &": {
        mt: 4,
      },
    },
  },
});

const Code = hope("code", ({ vars }) => ({
  baseStyle: {
    rounded: "md",
    bg: "neutral.100",
    px: "0.4em",
    py: "0.2em",
    fontSize: "0.9em",
    fontFamily: "mono",
    overflowWrap: "break-word",

    _dark: {
      bg: "neutral.700",
    },

    // Reset style inside Callout.
    ".hope-docs-Callout-root &": {
      border: `1px solid ${vars.colors.neutral["300"]}`,
      color: "neutral.700",

      _dark: {
        borderColor: "neutral.700",
        bg: "neutral.800",
        color: "neutral.200",
      },
    },

    // Reset style inside headings.
    "h1 &, h2 &, h3 &": {
      rounded: "none",
      bg: "transparent",
      p: 0,
      color: "primary.500",
      fontWeight: "semibold",

      _dark: {
        bg: "transparent",
        color: "primary.600",
      },
    },

    // Reset style inside table (ex: for props tables).
    "table &": {
      rounded: "none",
      bg: "transparent",
      p: 0,
      color: "primary.500",

      _dark: {
        bg: "transparent",
      },
    },
  },
}));

const Pre = (props: ComponentProps<"pre">) => {
  let domRef: HTMLPreElement | undefined;

  const [local, others] = splitProps(props, ["children"]);

  const [isCopied, setIsCopied] = createSignal(false);

  const reset = () => {
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    const innerText = domRef?.querySelector("code")?.innerText ?? "";
    setIsCopied(true);
    void navigator.clipboard.writeText(innerText);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <pre ref={domRef} onMouseLeave={reset} {...others}>
      <IconButton
        aria-label="copy to clipboard"
        variant={isCopied() ? "soft" : "plain"}
        colorScheme={isCopied() ? "success" : "neutral"}
        onClick={copyToClipboard}
        size="xs"
        pos="absolute"
        top={2}
        right={2}
        zIndex="docked"
        fontSize="16px"
        styleConfigOverride={{
          root: {
            compoundVariants: [
              {
                variants: {
                  variant: "plain",
                  colorScheme: "neutral",
                },
                style: {
                  bg: "neutral.50",

                  _hover: {
                    bg: "neutral.200",
                  },

                  _dark: {
                    _hover: {
                      bg: "neutral.700",
                    },
                  },
                },
              },
            ],
          },
        }}
      >
        <Show when={isCopied()} fallback={<CopyIcon />}>
          <CheckIcon />
        </Show>
      </IconButton>
      {local.children}
    </pre>
  );
};

const Ul = hope("ul", {
  baseStyle: {
    listStyleType: "disc",
    ml: 6,
    mt: 6,
    "p + &": {
      mt: 4,
    },
  },
});

const Ol = hope("ol", {
  baseStyle: {
    listStyleType: "decimal",
    ml: 6,
    mt: 6,
    "p + &": {
      mt: 4,
    },
  },
});

const Li = hope("li", {
  baseStyle: {
    my: 3,
  },
});

const Table = hope("table", {
  baseStyle: {
    w: "full",
    p: 0,
    fontSize: "sm",
    lineHeight: 5,
    borderCollapse: "collapse",
    _notFirst: {
      mt: 6,
    },
  },
});

const Tr = hope("tr", ({ vars }) => ({
  baseStyle: {
    bg: "transparent",
    m: 0,
    p: 0,
    _notLast: {
      borderBottom: `1px solid ${vars.colors.neutral[200]}`,

      _dark: {
        borderBottomColor: "neutral.800",
      },
    },
    _even: {
      bg: "neutral.50",

      _dark: {
        bg: "transparent",
      },
    },
  },
}));

const Th = hope("th", ({ vars }) => ({
  baseStyle: {
    m: 0,
    px: 4,
    py: 2,
    color: "neutral.600",
    fontWeight: "semibold",
    textAlign: "start",
    borderBottom: `1px solid ${vars.colors.neutral[300]}`,

    _dark: {
      color: "neutral.400",
      borderBottomColor: "neutral.700",
    },
  },
}));

const Td = hope("td", {
  baseStyle: {
    m: 0,
    px: 4,
    py: 2,
  },
});

const ExternalLink = (props: LinkProps) => {
  const isExternal = createMemo(() => props.href[0] !== "/");

  return (
    <Link
      {...props}
      target={isExternal() ? "_blank" : undefined}
      rel={isExternal() ? "noopener noreferrer" : undefined}
    />
  );
};

const A = hope(ExternalLink, {
  baseStyle: {
    color: "primary.500",
    textDecoration: "underline",

    _dark: {
      color: "primary.600",
    },
  },
});

export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => {
    const [local, others] = splitProps(props, ["children"]);

    return (
      <H1 {...others}>
        <MetaTitle>{local.children + " | Kobalte"}</MetaTitle>
        {local.children}
      </H1>
    );
  },
  h2: H2,
  h3: H3,
  p: P,
  code: Code,
  pre: Pre,
  ul: Ul,
  ol: Ol,
  li: Li,
  table: (props: any) => (
    <hope.div overflowX="auto">
      <Table {...props} />
    </hope.div>
  ),
  tr: Tr,
  th: Th,
  td: Td,
  a: A,
};
