import type { SourceCard } from "@/data/projects/types";
import "./SourceCards.css";

type SourceCardsProps = {
  cards: SourceCard[];
};

function formatIndex(index: number) {
  return String(index).padStart(2, "0");
}

export function SourceCards({ cards }: SourceCardsProps) {
  const rowCount = Math.max(0, ...cards.map((card) => card.items.length));
  const caption = cards.map((card) => card.title).join(" and ");

  return (
    <div className="source-card-container">
      <article className="source-card">
        <table className="source-card-table" aria-label={caption}>
          <thead>
            <tr>
              {cards.map((card) => (
                <th key={card.title} scope="col">
                  <span className="source-card-heading">
                    <span className="source-card-logo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={card.logoSrc} alt="" />
                    </span>
                    <span className="source-card-title">{card.title}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, rowIndex) => (
              <tr key={formatIndex(rowIndex)}>
                {cards.map((card) => {
                  const item = card.items[rowIndex];

                  return (
                    <td key={`${card.title}-${formatIndex(rowIndex)}`}>
                      {item ? (
                        <span className="source-card-item">
                          <span className="source-card-index" aria-hidden="true">
                            {formatIndex(rowIndex)}
                          </span>
                          <span className="source-card-item-label">{item}</span>
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </div>
  );
}
