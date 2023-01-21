import { Avatar, I18nProvider } from "../src";

export default function App() {
  return (
    <I18nProvider>
      <div style={{ display: "flex", gap: "20px" }}>
        <Avatar.Root fallbackDelay={600} class="AvatarRoot">
          <Avatar.Image
            class="AvatarImage"
            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
            alt="Colm Tuite"
          />
          <Avatar.Fallback class="AvatarFallback">CT</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root class="AvatarRoot">
          <Avatar.Image
            class="AvatarImage"
            src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
            alt="Pedro Duarte"
          />
          <Avatar.Fallback class="AvatarFallback">JD</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root class="AvatarRoot">
          <Avatar.Fallback class="AvatarFallback">PD</Avatar.Fallback>
        </Avatar.Root>
      </div>
    </I18nProvider>
  );
}
