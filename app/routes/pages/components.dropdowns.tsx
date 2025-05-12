import { Section } from "./components";
import { SortDropdown } from "~/components/filters";

export default function Dropdowns() {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-700">
      <Section title="Dropdown Menus" className="flex flex-col gap-40">
        <SortDropdown />
      </Section>
    </div>
  );
}
