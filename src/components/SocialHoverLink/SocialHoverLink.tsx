import type { AnchorHTMLAttributes, ReactNode } from "react";
import "./SocialHoverLink.css";

type SocialHoverLinkProps = {
  href: string;
  children: ReactNode;
  iconSrc?: string;
  /** Inline mark, for icons that animate on hover; takes precedence over iconSrc. */
  icon?: ReactNode;
  className?: string;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
>;

export function SocialHoverLink({
  href,
  children,
  iconSrc,
  icon,
  className,
  ...anchorProps
}: SocialHoverLinkProps) {
  const isExternal = href.startsWith("http");
  const classes = ["social-hover-link", className].filter(Boolean).join(" ");

  return (
    <a
      className={classes}
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      {...anchorProps}
    >
      {icon ? (
        <span className="social-hover-mark" aria-hidden="true">
          {icon}
        </span>
      ) : iconSrc ? (
        <span className="social-hover-mark" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- small decorative icon */}
          <img className="social-hover-mark-image" src={iconSrc} alt="" />
        </span>
      ) : null}
      {children}
    </a>
  );
}
