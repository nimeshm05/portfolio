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

export function Callout({ children, attribution, source }: CalloutProps) {
  const text = <CalloutText>{children}</CalloutText>;

  if (!attribution) {
    return <aside className="callout">{text}</aside>;
  }

  return (
    <blockquote className="callout callout--quoted">
      {text}
      <footer className="callout-attribution">
        <span className="callout-attribution-rule" aria-hidden="true" />
        <cite className="callout-attribution-name">{attribution}</cite>
        {source ? (
          <span className="callout-attribution-source">, {source}</span>
        ) : null}
      </footer>
    </blockquote>
  );
}
