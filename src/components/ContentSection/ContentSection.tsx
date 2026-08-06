import { ListItem } from "@/components/ListItem/ListItem";
import type { ContentSectionData } from "@/data/home";
import "./ContentSection.css";

type ContentSectionProps = {
  section: ContentSectionData;
  showDivider?: boolean;
};

export function ContentSection({
  section,
  showDivider = false,
}: ContentSectionProps) {
  return (
    <>
      {showDivider ? <hr className="content-section-divider" /> : null}
      <section className="content-section" aria-labelledby={section.id}>
        <div className="content-section-label-wrap">
          <h2 className="content-section-label" id={section.id}>
            {section.label}
          </h2>
        </div>
        <div className="content-section-list">
          {section.items.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              meta={item.meta}
              icon={item.icon}
              href={item.href}
              compactGap={section.compactGap}
            />
          ))}
        </div>
      </section>
    </>
  );
}
