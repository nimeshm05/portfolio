import type { RichTextBlock } from "@/data/projects/types";
import "./RichText.css";

type RichTextProps = {
  content: RichTextBlock;
};

export function RichText({ content }: RichTextProps) {
  if (content.type === "paragraphs") {
    return (
      <div className="rich-text">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="rich-text">
      {content.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <ol>
        {content.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      {content.outro?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
