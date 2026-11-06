import { Fragment } from "react";
import { Postmark } from "@/components/WorkStamps/WorkStamps";
import type { CalloutPostmark } from "@/data/projects/types";
import "./Callout.css";

type CalloutProps = {
  children: string;
  attribution?: string;
  source?: string;
  quoted?: boolean;
  /** Round postmark inked in the panel's corner */
  postmark?: CalloutPostmark;
  /** Varies the postmark's ink wear between callouts */
  postmarkSeed?: number;
};

function CalloutText({
  children,
  quoted,
}: {
  children: string;
  quoted: boolean;
}) {
  if (!quoted) {
    return (
      <p className="callout-text">
        {children.split("\n").map((line, index) => (
          <Fragment key={line}>
            {index > 0 ? <br /> : null}
            {line}
          </Fragment>
        ))}
      </p>
    );
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
  quoted = true,
  postmark,
  postmarkSeed = 1,
}: CalloutProps) {
  const text = <CalloutText quoted={quoted}>{children}</CalloutText>;
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
        {postmark ? (
          <Postmark
            className="callout-postmark"
            label={postmark.label}
            year={postmark.center}
            location={postmark.bottom}
            rotate={postmark.rotate}
            seed={postmarkSeed}
          />
        ) : null}
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
