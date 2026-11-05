import type { ReactNode } from "react";
import type { RichTextBlock } from "@/data/projects/types";
import "./RichText.css";

type RichTextProps = {
  content: RichTextBlock;
};

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((segment, index) => {
    if (
      segment.startsWith("**") &&
      segment.endsWith("**") &&
      segment.length > 4
    ) {
      return <strong key={index}>{segment.slice(2, -2)}</strong>;
    }

    if (segment.startsWith("*") && segment.endsWith("*") && segment.length > 2) {
      return <em key={index}>{segment.slice(1, -1)}</em>;
    }

    return segment;
  });
}

export function RichText({ content }: RichTextProps) {
  if (content.type === "paragraphs") {
    return (
      <div className="rich-text">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{renderInline(paragraph)}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="rich-text">
      {content.intro.map((paragraph) => (
        <p key={paragraph}>{renderInline(paragraph)}</p>
      ))}
      {/* role keeps list semantics in Safari once list-style is removed */}
      <ol className="rich-text-points" role="list">
        {content.items.map((item, index) => (
          <li key={item} className="rich-text-point">
            {/* One line tall, so the circle centres on the first line of text */}
            <span className="rich-text-point-marker" aria-hidden="true">
              <span className="rich-text-point-circle">
                <span className="rich-text-point-number">{index + 1}</span>
              </span>
            </span>
            <span className="rich-text-point-text">{renderInline(item)}</span>
          </li>
        ))}
      </ol>
      {content.outro?.map((paragraph) => (
        <p key={paragraph}>{renderInline(paragraph)}</p>
      ))}
    </div>
  );
}
