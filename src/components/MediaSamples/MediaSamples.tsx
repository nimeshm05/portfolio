import { ProjectBanner } from "@/components/ProjectBanner/ProjectBanner";
import type { MediaSampleData } from "@/data/home";
import "./MediaSamples.css";

type MediaSamplesProps = {
  samples: MediaSampleData[];
};

export function MediaSamples({ samples }: MediaSamplesProps) {
  return (
    <ul className="media-samples">
      {samples.map((sample) => (
        <li key={sample.id} className="media-sample">
          <ProjectBanner
            src={sample.videoSrc}
            alt={`${sample.title}: ${sample.caption}`}
            type="video"
            aspectRatio={sample.aspectRatio}
            variant="card"
          />
          <div className="media-sample-copy">
            <span className="media-sample-title">{sample.title}</span>
            <p className="media-sample-caption">{sample.caption}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
