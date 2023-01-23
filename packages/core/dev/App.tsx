import { Collapsible, I18nProvider } from "../src";

export default function App() {
  return (
    <I18nProvider>
      <Collapsible.Root class="collapsible">
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content class="collapsible__content">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid dolore, dolores eveniet
          excepturi laboriosam laudantium libero molestias, non officiis perferendis placeat quas
          qui reiciendis repudiandae soluta tenetur vero voluptates. Aliquam aliquid amet animi
          aspernatur blanditiis cupiditate debitis dignissimos dolor, doloremque eligendi error
          fugiat fugit illo in inventore neque nisi nobis non nostrum obcaecati, officiis optio
          perferendis quasi qui quidem quod reiciendis rem repudiandae saepe similique soluta sunt
          suscipit, tenetur totam ullam veniam vitae? Amet, atque blanditiis ipsa ipsam ipsum minima
          minus reprehenderit sint voluptas. Atque commodi distinctio, doloribus, eligendi, esse ex
          facilis iure mollitia nihil officia perspiciatis qui recusandae suscipit!
        </Collapsible.Content>
      </Collapsible.Root>
    </I18nProvider>
  );
}
