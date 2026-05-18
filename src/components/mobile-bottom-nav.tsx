"use client";

import {
  House,
  ListHeart,
  PaperPlaneTilt,
  UserCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", icon: House },
  { href: "/races", label: "Races", icon: ListHeart },
  { href: "/sent", label: "Sent", icon: PaperPlaneTilt },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

const focusedPrefixes = ["/sign-in", "/sign-up", "/dashboard/runs/new"];
const appRoutePrefixes = ["/dashboard", "/profile", "/races", "/sent"];

function isPublicRacePath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return (
    segments.length === 2 &&
    !appRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  if (
    isPublicRacePath(pathname) ||
    focusedPrefixes.some((prefix) => pathname.startsWith(prefix))
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 grid w-full max-w-md -translate-x-1/2 grid-cols-4 gap-1 rounded-t-[1.5rem] border bg-card/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-14px_40px_rgb(91_53_200_/_14%)] backdrop-blur-xl">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/home"
            ? pathname === "/home"
            : pathname.startsWith(item.href) ||
              (item.href === "/races" && pathname.startsWith("/dashboard"));

        return (
          <Link
            className={cn(
              "flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 text-muted-foreground text-xs transition-colors",
              active && "bg-luvy-lavender font-bold text-luvy-purple",
            )}
            href={item.href}
            key={item.href}
          >
            <Icon
              className="mb-1 size-5"
              weight={active ? "fill" : "regular"}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
