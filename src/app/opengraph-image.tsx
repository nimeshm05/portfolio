import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
  Link-preview card for the whole site. Without one, chat apps pick a photo
  off the page (it was choosing a group shot). A plain text card in the
  site's own type keeps the preview about the work.
*/

export const alt = "Nimesh Mohanakrishnan, product designer in Seattle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "public/assets/open-runde-font/desktop");

export default async function Image() {
  const [semibold, regular] = await Promise.all([
    readFile(join(fontDir, "OpenRunde-Semibold.otf")),
    readFile(join(fontDir, "OpenRunde-Regular.otf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#ffffff",
          fontFamily: "Open Runde",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#111111",
          }}
        >
          Nimesh Mohanakrishnan
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            fontWeight: 400,
            lineHeight: 1.35,
            color: "#7a7a7a",
            maxWidth: 900,
          }}
        >
          Product designer in Seattle. MS in Human Centered Design &amp;
          Engineering at the University of Washington.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Open Runde", data: semibold, style: "normal", weight: 600 },
        { name: "Open Runde", data: regular, style: "normal", weight: 400 },
      ],
    },
  );
}
