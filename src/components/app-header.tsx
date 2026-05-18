import Link from "next/link";

import { AppHeaderAuthControls } from "@/components/app-header-auth-controls";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { RabbitEarsLogo } from "@/components/rabbit-ears-logo";
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
            "mx-auto flex h-16 w-full items-center justify-between px-4 box-content",
            wide ? "max-w-6xl sm:px-6 lg:px-8" : "max-w-md",
          )}
        >
          <Link
            className="flex items-center gap-2 font-bold tracking-tight text-foreground"
            href="/home"
          >
            <RabbitEarsLogo className="size-7" />
            <span className="text-2xl">luvy</span>
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
