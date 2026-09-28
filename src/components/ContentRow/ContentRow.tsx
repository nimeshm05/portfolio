import Link from "next/link";
import "./ContentRow.css";

type ContentRowProps = {
  title: string;
  href?: string;
  year?: string;
  category?: string;
  aside?: string;
};

function rowTitle(title: string) {
  return title.replace(/,\s*$/, "");
}

export function ContentRow({
  title,
  href,
  year,
  category,
  aside,
}: ContentRowProps) {
  const isExternal = Boolean(href?.startsWith("http"));
  const isInternal = Boolean(href?.startsWith("/"));

  const content = (
    <>
      <span className="content-row-copy">
        <span className="content-row-title">{rowTitle(title)}</span>
        {year || category ? (
          <span className="content-row-meta">
            {year ? <span>{year}</span> : null}
            {year && category ? (
              <span className="content-row-dot" aria-hidden="true" />
            ) : null}
            {category ? <span>{category}</span> : null}
          </span>
        ) : null}
      </span>
      {aside ? <span className="content-row-aside">{aside}</span> : null}
    </>
  );

  if (isInternal && href) {
    return (
      <Link className="content-row" href={href}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        className="content-row"
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return <div className="content-row">{content}</div>;
}
