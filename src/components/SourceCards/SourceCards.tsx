import type { SourceCard } from "@/data/projects/types";
import "./SourceCards.css";

type SourceCardsProps = {
  cards: SourceCard[];
};

export function SourceCards({ cards }: SourceCardsProps) {
  return (
    <div className="source-cards">
      {cards.map((card) => (
        <article key={card.title} className="source-card">
          <header className="source-card-header">
            <span className="source-card-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.logoSrc} alt={card.logoAlt} />
            </span>
            <h3 className="source-card-title">{card.title}</h3>
          </header>
          <ul className="source-card-list">
            {card.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
