import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["facebookexternalhit", "Facebot", "InstagramBot"],
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  };
}
