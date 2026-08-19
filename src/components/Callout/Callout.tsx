import "./Callout.css";

type CalloutVariant = "quote" | "body";

type CalloutProps = {
  children: string;
  attribution?: string;
  source?: string;
  designPrinciple?: string;
  variant?: CalloutVariant;
};

function CalloutText({
  children,
  variant,
}: {
  children: string;
  variant: CalloutVariant;
}) {
  if (variant === "body") {
    return <p className="callout-text">{children}</p>;
  }

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
  variant = "quote",
}: CalloutProps) {
  const text = <CalloutText variant={variant}>{children}</CalloutText>;
  const className = variant === "body" ? "callout callout--body" : "callout";

  if (designPrinciple) {
    return (
      <div className="callout-with-principle">
        <aside className={className}>{text}</aside>
        <p className="callout-design-principle">
          <span className="callout-design-principle-label">Design Principle:</span>{" "}
          {designPrinciple}
        </p>
      </div>
    );
  }

  if (!attribution) {
    return <aside className={className}>{text}</aside>;
  }

  return (
    <div className="callout-with-attribution">
      <blockquote className={`${className} callout--quoted`}>{text}</blockquote>
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
