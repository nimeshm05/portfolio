import "./Callout.css";

type CalloutProps = {
  children: string;
  attribution?: string;
  source?: string;
  designPrinciple?: string;
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
  designPrinciple,
}: CalloutProps) {
  const text = <CalloutText>{children}</CalloutText>;

  if (designPrinciple) {
    return (
      <div className="callout-with-principle">
        <aside className="callout">{text}</aside>
        <p className="callout-design-principle">
          <span className="callout-design-principle-label">Design Principle:</span>{" "}
          {designPrinciple}
        </p>
      </div>
    );
  }

  if (!attribution) {
    return <aside className="callout">{text}</aside>;
  }

  return (
    <div className="callout-with-attribution">
      <blockquote className="callout callout--quoted">{text}</blockquote>
      <footer className="callout-attribution">
        <span className="callout-attribution-rule" aria-hidden="true" />
        <cite className="callout-attribution-name">{attribution}</cite>
        {source ? (
          <span className="callout-attribution-source">, {source}</span>
        ) : null}
      </footer>
    </div>
  );
}
