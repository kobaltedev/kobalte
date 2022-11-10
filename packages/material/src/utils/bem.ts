/** Utility to create BEM class names. */
export function bem(block: string) {
  return {
    block: () => block,
    withElement: (element: string) => `${block}__${element}`,
    withModifier: (modifier: string) => `${block}--${modifier}`,
    withElementModifier: (element: string, modifier: string) => `${block}__${element}--${modifier}`,
  };
}
