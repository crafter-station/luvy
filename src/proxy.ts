import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/home(.*)",
  "/dashboard(.*)",
  "/profile(.*)",
  "/races(.*)",
  "/sent(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/home(.*)",
    "/dashboard(.*)",
    "/profile(.*)",
    "/races(.*)",
    "/sent(.*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
