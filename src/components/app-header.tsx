import { Heart } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { AppHeaderAuthControls } from "@/components/app-header-auth-controls";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { cn } from "@/lib/utils";

export function AppHeader({
  showBottomNav = true,
  wide = false,
}: {
  showBottomNav?: boolean;
  wide?: boolean;
}) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div
          className={cn(
            "mx-auto flex h-16 w-full items-center justify-between px-4",
            wide ? "max-w-6xl sm:px-6 lg:px-8" : "max-w-md",
          )}
        >
          <Link
            className="flex items-center gap-2 font-bold tracking-tight text-luvy-purple"
            href="/home"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-luvy-peach text-luvy-coral shadow-sm">
              <Heart className="size-5" weight="fill" />
            </span>
            <span className="text-2xl">Luvy</span>
          </Link>
          <div className="flex items-center gap-2">
            <AppHeaderAuthControls />
          </div>
        </div>
      </header>
      {showBottomNav ? <MobileBottomNav /> : null}
    </>
  );
}
