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
  const className = [
    "callout",
    variant === "body" ? "callout--body" : "",
    attribution ? "callout--quoted" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="callout-rule" aria-hidden="true" />
      <div className="callout-body">
        {text}
        {designPrinciple ? (
          <p className="callout-design-principle">
            <span className="callout-design-principle-label">
              Design Principle:
            </span>{" "}
            {designPrinciple}
          </p>
        ) : null}
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
