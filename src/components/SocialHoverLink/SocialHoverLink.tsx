import type { AnchorHTMLAttributes, ReactNode } from "react";
import "./SocialHoverLink.css";

type SocialHoverLinkProps = {
  href: string;
  children: ReactNode;
  iconSrc?: string;
  className?: string;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
>;

export function SocialHoverLink({
  href,
  children,
  iconSrc,
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
      {iconSrc ? (
        <span className="social-hover-mark" aria-hidden="true">
          <img className="social-hover-mark-image" src={iconSrc} alt="" />
        </span>
      ) : null}
      {children}
    </a>
  );
}
