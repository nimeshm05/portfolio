import "./ViewportEdgeBlur.css";

const BLUR_LAYERS = 6;

type ViewportEdgeBlurProps = {
  contained?: boolean;
};

export function ViewportEdgeBlur({ contained = false }: ViewportEdgeBlurProps) {
  return (
    <div
      className={`viewport-edge-blur${contained ? " viewport-edge-blur--contained" : ""}`}
      aria-hidden="true"
    >
      <div className="viewport-edge-blur-band viewport-edge-blur-band--top">
        {Array.from({ length: BLUR_LAYERS }, (_, index) => (
          <div
            key={`top-${index}`}
            className="viewport-edge-blur-layer"
          />
        ))}
      </div>
      <div className="viewport-edge-blur-band viewport-edge-blur-band--bottom">
        {Array.from({ length: BLUR_LAYERS }, (_, index) => (
          <div
            key={`bottom-${index}`}
            className="viewport-edge-blur-layer"
          />
        ))}
      </div>
    </div>
  );
}
