import type { ReactNode } from "react";
import Image from "next/image";
import "./Header.css";

type HeaderProps = {
  name: string;
  bio: readonly string[];
  avatarSrc: string;
  avatarAlt: string;
  children?: ReactNode;
  bottom?: ReactNode;
};

export function Header({
  name,
  bio,
  avatarSrc,
  avatarAlt,
  children,
  bottom,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-profile">
        <div className="site-header-avatar">
          <Image
            className="site-header-avatar-image"
            src={avatarSrc}
            alt={avatarAlt}
            width={60}
            height={60}
            priority
          />
        </div>
        <div className="site-header-details">
          <div className="site-header-info">
            <h1 className="site-header-name">{name}</h1>
            <div className="site-header-bio">
              {bio.map((paragraph) => (
                <p key={paragraph} className="site-header-bio-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {children}
        </div>
        {bottom}
      </div>
    </header>
  );
}
