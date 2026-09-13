import type { DataAttributeCard } from "@/data/projects/types";
import "./DataAttributeCards.css";

type DataAttributeCardsProps = {
  cards: DataAttributeCard[];
};

export function DataAttributeCards({ cards }: DataAttributeCardsProps) {
  return (
    <ul className="data-attribute-cards">
      {cards.map((card) => (
        <li
          key={card.title}
          className={`data-attribute-card data-attribute-card--${card.tone}`}
        >
          <span className="data-attribute-card-rule" aria-hidden="true" />
          <div className="data-attribute-card-copy">
            <p className="data-attribute-card-title">{card.title}</p>
            <p className="data-attribute-card-description">{card.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
