import "./Callout.css";

type CalloutProps = {
  children: string;
  attribution?: string;
  source?: string;
};

function CalloutText({ children }: { children: string }) {
  return (
    <p className="callout-text">
      <span className="callout-quote">“</span>
      {children}”
    </p>
  );
}

export function Callout({
  children,
  attribution,
  source,
}: CalloutProps) {
  const text = <CalloutText>{children}</CalloutText>;
  const className = [
    "callout",
    attribution ? "callout--quoted" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="callout-rule" aria-hidden="true" />
      <div className="callout-body">
        {text}
        {attribution ? (
          <footer className="callout-attribution">
            <cite className="callout-attribution-name">{attribution}</cite>
            {source ? (
              <span className="callout-attribution-source">{source}</span>
            ) : null}
          </footer>
        ) : null}
      </div>
      <span className="callout-rule" aria-hidden="true" />
    </>
  );

  if (attribution) {
    return <blockquote className={className}>{inner}</blockquote>;
  }

  return <aside className={className}>{inner}</aside>;
}
