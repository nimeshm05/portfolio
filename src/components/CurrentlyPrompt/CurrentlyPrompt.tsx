import { MorphingArrowRight } from "@/components/MorphingArrowRight/MorphingArrowRight";
import { currently } from "@/data/home";
import "./CurrentlyPrompt.css";

export function CurrentlyPrompt() {
  return (
    <p
      className="currently-prompt"
      aria-label={`${currently.label} ${currently.status}`}
    >
      <span className="currently-prompt-icon" aria-hidden="true">
        <MorphingArrowRight variant="right" />
      </span>
      <span className="currently-prompt-copy">
        <span className="currently-prompt-label">{currently.label}</span>
        <span className="currently-prompt-status">{currently.status}</span>
      </span>
    </p>
  );
}
