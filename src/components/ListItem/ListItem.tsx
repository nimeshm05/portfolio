import "./ListItem.css";

type ListItemProps = {
  title: string;
  meta?: string;
  icon?: string;
  href?: string;
  compactGap?: boolean;
};

export function ListItem({
  title,
  meta,
  icon,
  href = "#",
  compactGap = false,
}: ListItemProps) {
  return (
    <a
      className={`list-item${compactGap ? " list-item--compact" : ""}`}
      href={href}
    >
      {icon ? (
        <span className="list-item-icon" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt="" width={20} height={20} />
        </span>
      ) : null}
      <span className="list-item-title">
        {title}
        {meta ? <span className="list-item-meta"> {meta}</span> : null}
      </span>
      <span className="list-item-chevron" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/icons/chevron-right.svg"
          alt=""
          width={20}
          height={20}
        />
      </span>
    </a>
  );
}
