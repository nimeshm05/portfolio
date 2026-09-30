import { footerLinks } from "@/data/home";
import "./SocialIconRow.css";

const socialLinks = footerLinks.filter((link) => "iconSrc" in link);

export function SocialIconRow() {
  return (
    <nav className="social-icon-row" aria-label="Social links">
      {socialLinks.map((link) => {
        const isExternal = link.href.startsWith("http");

        return (
          <a
            key={link.id}
            className="social-icon-row-link"
            href={link.href}
            aria-label={link.label}
            data-cuelume-press={isExternal ? "arrival" : undefined}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- small decorative icon */}
            <img className="social-icon-row-image" src={"iconSrc" in link ? link.iconSrc : undefined} alt="" />
          </a>
        );
      })}
    </nav>
  );
}
