import { SignIn } from "@clerk/nextjs";
import { AppHeader } from "@/components/app-header";

export default function SignInPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-md items-center justify-center px-4 py-8">
        <SignIn />
      </main>
    </>
  );
}
