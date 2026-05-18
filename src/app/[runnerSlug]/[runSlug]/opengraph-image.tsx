import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import heartAsset from "@/app/public/assets/hearth.png";
import { getRunDetailsByPublicSlugs } from "@/lib/runs";

export const alt = "Luvy race support page";
export const contentType = "image/png";
export const size = {
  width: 800,
  height: 420,
};

function formatRaceDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone,
  }).format(date);
}

function getOrigin(requestHeaders: Headers) {
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";

  return host ? `${protocol}://${host}` : "https://luvy.run";
}

export default async function Image({
  params,
}: {
  params: Promise<{ runnerSlug: string; runSlug: string }>;
}) {
  const { runnerSlug, runSlug } = await params;
  const data = await getRunDetailsByPublicSlugs(runnerSlug, runSlug);

  if (!data) {
    notFound();
  }

  const runnerName = data.user.displayName ?? data.user.slug;
  const raceDate = formatRaceDate(data.run.raceStartsAt, data.run.raceTimezone);
  const heartUrl = new URL(
    heartAsset.src,
    getOrigin(await headers()),
  ).toString();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#fff8ef",
        color: "#231636",
        fontFamily: "Arial, sans-serif",
        padding: 30,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 12% 0%, rgba(122, 78, 206, 0.18), transparent 30%), radial-gradient(circle at 86% 12%, rgba(255, 95, 88, 0.22), transparent 30%), linear-gradient(135deg, rgba(247, 237, 255, 0.92), rgba(255, 248, 239, 0.95))",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -68,
          top: 24,
          width: 310,
          height: 520,
          borderRadius: 56,
          background: "linear-gradient(180deg, #ffb6a8, #ff625c)",
          opacity: 0.86,
          transform: "rotate(8deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 30,
          bottom: -110,
          width: 240,
          height: 240,
          borderRadius: 999,
          background: "rgba(122, 78, 206, 0.14)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 510,
          zIndex: 1,
        }}
      >
        <div />

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div
            style={{
              display: "flex",
              color: "#ff5f58",
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Send race day love
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 54,
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.88,
            }}
          >
            {runnerName}
          </div>
          <div
            style={{
              display: "flex",
              color: "#5c3b83",
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            {data.run.title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#6d6077",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            <span>{raceDate}</span>
            {data.run.location ? <span>in {data.run.location}</span> : null}
          </div>
        </div>
        <div />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
          width: 220,
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 198,
            height: 198,
            borderRadius: 42,
            background: "#ffffff",
            border: "8px solid #ffe4dc",
            boxShadow: "0 28px 70px rgba(54, 26, 96, 0.24)",
            overflow: "hidden",
            transform: "rotate(2deg)",
          }}
        >
          {data.user.imageUrl ? (
            // biome-ignore lint/performance/noImgElement: ImageResponse renders remote images with plain img tags.
            <img
              alt={runnerName}
              height={198}
              src={data.user.imageUrl}
              style={{ objectFit: "cover" }}
              width={198}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                background: "#ffe6d7",
                color: "#ff5f58",
                fontSize: 64,
                fontWeight: 900,
              }}
            >
              {runnerName[0]?.toUpperCase() ?? "L"}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 118,
            height: 92,
            marginTop: -22,
            borderRadius: 999,
            background: "rgba(255, 248, 239, 0.9)",
            boxShadow: "0 16px 36px rgba(54, 26, 96, 0.16)",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: ImageResponse renders static assets with plain img tags. */}
          <img
            alt="Luvy heart bag"
            height={92}
            src={heartUrl}
            style={{ objectFit: "contain" }}
            width={118}
          />
        </div>
        <div
          style={{
            display: "flex",
            borderRadius: 999,
            color: "#2f1947",
            fontSize: 18,
            fontWeight: 800,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          luvy.run
        </div>
      </div>
    </div>,
    size,
  );
}
