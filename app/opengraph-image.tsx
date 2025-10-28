import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OgImage() {
  const background =
    "linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 65%, #1d4ed8 100%)";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background,
          color: "#f8fafc",
          padding: "64px",
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            maxWidth: "640px",
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#38bdf8",
            }}
          >
            Allied Advantage Ads
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            #1 PPC Leads for Real Estate Wholesalers
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#cbd5f5",
              lineHeight: 1.4,
            }}
          >
            Unlock motivated seller leads nationwide with high-converting campaigns
            built for real estate wholesalers.
          </div>
          <div
            style={{
              marginTop: 48,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 120,
                height: 6,
                backgroundColor: "#38bdf8",
                borderRadius: 9999,
              }}
            />
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#38bdf8",
                letterSpacing: "0.08em",
              }}
            >
              alliedadvantage.co
            </div>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              margin: "auto",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.65), rgba(37,99,235,0.45) 60%, rgba(15,23,42,0) 100%)",
              filter: "blur(0px)",
            }}
          />
          <div
            style={{
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: "10px solid rgba(56,189,248,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "radial-gradient(circle at 65% 35%, rgba(226,232,240,0.2), rgba(148,163,184,0.12) 45%, rgba(15,23,42,0.65) 100%)",
              boxShadow: "0 30px 60px rgba(15,23,42,0.45)",
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background:
                  "conic-gradient(from 180deg at 50% 50%, rgba(56,189,248,0.9), rgba(14,165,233,0.8), rgba(59,130,246,0.85), rgba(56,189,248,0.9))",
                boxShadow: "0 20px 40px rgba(15,23,42,0.6)",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
