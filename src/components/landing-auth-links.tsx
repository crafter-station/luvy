"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const createRaceHref = "/dashboard/runs/new";

function useAuthHomeLink() {
  const { isLoaded, isSignedIn } = useUser();

  return isLoaded && isSignedIn
    ? { href: "/home", label: "Go home" }
    : { href: "/sign-in", label: "Sign in" };
}

export function LandingHeroCtas() {
  const secondary = useAuthHomeLink();

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link href={createRaceHref}>
        <Button size="lg">
          Create your race page
          <ArrowRight />
        </Button>
      </Link>
      <Link href={secondary.href}>
        <Button size="lg" variant="outline">
          {secondary.label}
        </Button>
      </Link>
    </div>
  );
}

export function LandingCreateRaceButton({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: "outline" | "secondary";
}) {
  return (
    <Link href={createRaceHref}>
      <Button size="lg" variant={variant}>
        {children}
      </Button>
    </Link>
  );
}

export function LandingFooterAuthLink() {
  const authLink = useAuthHomeLink();

  return (
    <Link
      className="text-muted-foreground text-sm transition-colors hover:text-foreground"
      href={authLink.href}
    >
      {authLink.label}
    </Link>
  );
}
