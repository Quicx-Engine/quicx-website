import { ImageResponse } from "next/og";
import { LOGO_RATIO, OG, OG_SIZE, loadOgFonts, loadOgLogo } from "@/lib/og";

// Measured: docs/report "value admission", steady overload (2,000 tasks/s for
// 15 s, 10 % valuable). Same rows as VALUE_ROWS in src/lib/benchmarks.ts.
export const alt =
  "Quicx, the open-source task queue in C: when memory is full, Quicx keeps the valuable work. Under overload it finished 100 % of valuable tasks; a queue that refuses when full finished 31.6 %.";
export const size = OG_SIZE;
export const contentType = "image/png";

const LOGO_H = 56;

// Fixed widths: Satori sizes a flex-grow track by its content, so a 100 % fill
// would push the label and the figure out of the row.
const LABEL_W = 250;
const VALUE_W = 140;
const TRACK_W = 1200 - 2 * 64 - 2 - 2 * 22 - LABEL_W - VALUE_W; // 636

function Bar({
  label,
  value,
  fill,
  color,
  labelColor,
}: {
  label: string;
  value: string;
  fill: number;
  color: string;
  labelColor: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "44px" }}>
      <div
        style={{
          display: "flex",
          width: `${LABEL_W}px`,
          fontFamily: "Archivo",
          fontWeight: 500,
          fontSize: "21px",
          color: labelColor,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          width: `${TRACK_W}px`,
          height: "14px",
          background: OG.hairline,
          borderRadius: "2px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: `${Math.round((TRACK_W * fill) / 100)}px`,
            height: "14px",
            background: color,
            borderRadius: "2px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: `${VALUE_W}px`,
          fontFamily: "JetBrains Mono",
          fontWeight: 500,
          fontSize: "26px",
          letterSpacing: "-0.5px",
          color: labelColor,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default async function Image() {
  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo()]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: OG.ground,
          padding: "50px 64px 52px",
          fontFamily: "Archivo",
        }}
      >
        {/* Header: wordmark, and what it is */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src={logo} width={Math.round(LOGO_H * LOGO_RATIO)} height={LOGO_H} alt="" />
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontWeight: 500,
              fontSize: "17px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: OG.muted,
            }}
          >
            Open-source task queue in C
          </div>
        </div>

        {/* Headline, in the site's condensed display voice */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "30px",
            fontFamily: "Archivo",
            fontWeight: 900,
            fontSize: "100px",
            lineHeight: 0.9,
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
            color: OG.text,
          }}
        >
          <div style={{ display: "flex" }}>When memory is full,</div>
          <div style={{ display: "flex" }}>Quicx keeps the</div>
          <div style={{ display: "flex" }}>valuable work.</div>
        </div>

        {/* The proof: one instrument well, a mono title strip, two rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            background: OG.well,
            border: `1px solid ${OG.hairlineStrong}`,
            borderRadius: "3px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 22px",
              borderBottom: `1px solid ${OG.hairline}`,
              fontFamily: "JetBrains Mono",
              fontWeight: 500,
              fontSize: "14px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: OG.dim,
            }}
          >
            <div style={{ display: "flex" }}>Valuable tasks done under overload</div>
            <div style={{ display: "flex" }}>Measured</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "8px 22px 10px" }}>
            <Bar label="Quicx" value={"100\u00a0%"} fill={100} color={OG.orange} labelColor={OG.text} />
            <Bar
              label="Queue that refuses"
              value={"31.6\u00a0%"}
              fill={31.6}
              color={OG.dim}
              labelColor={OG.muted}
            />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
