import { useId } from "react";
import "./ResumeHoverIcon.css";

/** Inline copy of /assets/social-media-icons/resume.svg so the PDF glyph can
   animate when its SocialHoverLink is hovered. Ids are scoped per instance
   because the header and footer both render one. */
export function ResumeHoverIcon() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const shadowId = `resume-shadow-${uid}`;
  const foldId = `resume-fold-${uid}`;
  const clipId = `resume-clip-${uid}`;

  return (
    <svg
      className="resume-hover-icon"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="20" fill="#262626" />
      <g filter={`url(#${shadowId})`}>
        <g clipPath={`url(#${clipId})`}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.9814 7H23L30.5 14.5V28.7454C30.5 30.5445 28.943 32 27.0252 32H13.9814C12.057 32 10.5 30.5445 10.5 28.7454V10.2546C10.5 8.45552 12.0569 7 13.9814 7Z"
            fill="white"
          />
          <g filter={`url(#${foldId})`}>
            <path
              d="M23 12.1025V7L30.5 14.5H25.5107C23.2655 14.5 23 12.9196 23 12.1025Z"
              fill="#D4D4D8"
            />
          </g>
          <path
            className="resume-hover-icon-logo"
            d="M25.3066 23.1449C24.6343 22.426 22.7986 22.7189 22.359 22.7722C21.7127 22.1331 21.2732 21.3609 21.118 21.0946C21.3507 20.3757 21.5058 19.6567 21.5317 18.8846C21.5317 18.2189 21.2732 17.5 20.5492 17.5C20.2907 17.5 20.0579 17.6597 19.9286 17.8727C19.6184 18.432 19.7476 19.5503 20.2389 20.6953C19.9545 21.5207 19.6959 22.3195 18.972 23.7308C18.2222 24.0502 16.645 24.7959 16.5157 25.5947C16.464 25.8343 16.5416 26.074 16.7226 26.2604C16.9035 26.4201 17.1362 26.5 17.369 26.5C18.3256 26.5 19.2564 25.1421 19.9028 23.997C20.4457 23.8107 21.299 23.5443 22.1522 23.3846C23.1605 24.2899 24.0396 24.423 24.505 24.423C25.1255 24.423 25.3583 24.1568 25.4358 23.9171C25.5651 23.6509 25.4875 23.358 25.3066 23.1449ZM24.6601 23.5976C24.6343 23.784 24.4017 23.9704 23.9879 23.8639C23.4967 23.7308 23.0571 23.4911 22.6693 23.1716C23.0055 23.1183 23.7552 23.0384 24.2982 23.1449C24.505 23.1982 24.7119 23.3313 24.6601 23.5976ZM20.3423 18.1124C20.394 18.0325 20.4716 17.9793 20.5492 17.9793C20.7819 17.9793 20.8336 18.2721 20.8336 18.5118C20.8077 19.0711 20.7043 19.6302 20.5233 20.1627C20.1355 19.0976 20.2131 18.352 20.3423 18.1124ZM20.2907 23.2781C20.4975 22.8521 20.7819 22.1064 20.8853 21.7869C21.118 22.1862 21.5058 22.6656 21.7127 22.8786C21.7127 22.9053 20.9112 23.065 20.2907 23.2781ZM18.7652 24.3432C18.1705 25.355 17.5499 25.9941 17.2138 25.9941C17.1621 25.9941 17.1104 25.9674 17.0587 25.9408C16.9811 25.8875 16.9552 25.8077 16.9811 25.7012C17.0587 25.3284 17.7309 24.8225 18.7652 24.3432Z"
            fill="#343A3E"
          />
        </g>
      </g>
      <defs>
        <filter
          id={shadowId}
          x="6.125"
          y="5.625"
          width="28.75"
          height="28.75"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.5" />
          <feGaussianBlur stdDeviation="0.9375" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.125" />
          <feGaussianBlur stdDeviation="0.1875" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
        </filter>
        <filter
          id={foldId}
          x="21.125"
          y="5.625"
          width="11.25"
          height="11.25"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.5" />
          <feGaussianBlur stdDeviation="0.9375" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.125" />
          <feGaussianBlur stdDeviation="0.1875" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="-0.25" />
          <feGaussianBlur stdDeviation="0.25" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="shape" result="effect3_innerShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="-0.25" />
          <feGaussianBlur stdDeviation="0.75" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.24 0" />
          <feBlend mode="normal" in2="effect3_innerShadow" result="effect4_innerShadow" />
        </filter>
        <clipPath id={clipId}>
          <rect width="25" height="25" fill="white" transform="translate(8 7)" />
        </clipPath>
      </defs>
    </svg>
  );
}
