import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import heartAsset from "@/app/public/assets/hearth.png";
import { getRunDetailsByPublicSlugs } from "@/lib/runs";

export const alt = "Luvy race support page";
export const contentType = "image/png";
export const size = {
  width: 600,
  height: 315,
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
        background: "#fff7ee",
        color: "#231636",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff7ee",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -44,
          top: 0,
          width: 210,
          height: 315,
          borderRadius: 42,
          background: "#ff8c7c",
          transform: "rotate(7deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: -92,
          width: 190,
          height: 190,
          borderRadius: 999,
          background: "#eadff7",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 380,
          zIndex: 1,
        }}
      >
        <div />

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div
            style={{
              display: "flex",
              color: "#ff5f58",
              fontSize: 14,
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
              fontSize: 42,
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
              fontSize: 25,
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
              fontSize: 16,
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
          width: 160,
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 146,
            height: 146,
            borderRadius: 32,
            background: "#ffffff",
            border: "6px solid #ffe4dc",
            overflow: "hidden",
            transform: "rotate(2deg)",
          }}
        >
          {data.user.imageUrl ? (
            // biome-ignore lint/performance/noImgElement: ImageResponse renders remote images with plain img tags.
            <img
              alt={runnerName}
              height={146}
              src={data.user.imageUrl}
              style={{ objectFit: "cover" }}
              width={146}
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
                fontSize: 46,
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
            width: 90,
            height: 70,
            marginTop: -16,
            borderRadius: 999,
            background: "#fff7ee",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: ImageResponse renders static assets with plain img tags. */}
          <img
            alt="Luvy heart bag"
            height={70}
            src={heartUrl}
            style={{ objectFit: "contain" }}
            width={90}
          />
        </div>
        <div
          style={{
            display: "flex",
            borderRadius: 999,
            color: "#2f1947",
            fontSize: 14,
            fontWeight: 800,
            marginTop: 6,
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
