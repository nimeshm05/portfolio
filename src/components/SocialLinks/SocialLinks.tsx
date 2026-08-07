import "./SocialLinks.css";

export type SocialLinkItem = {
  id: string;
  label: string;
  href: string;
  iconSrc: string;
};

type SocialLinksProps = {
  links: readonly SocialLinkItem[];
};

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <ul className="social-links" aria-label="Social links">
      {links.map((link) => (
        <li key={link.id}>
          <a
            className={`social-link social-link--${link.id}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="social-link-icon"
              src={link.iconSrc}
              alt=""
              width={20}
              height={20}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
