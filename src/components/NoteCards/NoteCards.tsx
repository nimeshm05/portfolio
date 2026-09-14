import type { NoteCardData } from "@/data/home";
import "./NoteCards.css";

type NoteCardsProps = {
  notes: NoteCardData[];
};

export function NoteCards({ notes }: NoteCardsProps) {
  return (
    <ul className="note-cards">
      {notes.map((note) => (
        <li
          key={note.id}
          className={`note-card-stack note-card-stack--${note.tone}`}
        >
          <span className="note-card-backing" aria-hidden="true" />
          <a
            className="note-card"
            href={note.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="note-card-top">
              <div className="note-card-heading">
                <span className="note-card-rule" aria-hidden="true" />
                <p className="note-card-title">{note.title}</p>
              </div>
              <p className="note-card-source">{note.source}</p>
            </div>
            <p className="note-card-description">{note.description}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
