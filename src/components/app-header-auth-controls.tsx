"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function AppHeaderAuthControls() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <SignInButton mode="redirect">
      <Button size="sm" variant="ghost">
        Sign in
      </Button>
    </SignInButton>
  );
}
