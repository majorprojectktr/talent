import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const isPublic = isPublicRoute(req);
  const { userId } = await auth();

  if (!isPublic) {
    await auth.protect();
  }

  if (userId) {
    // Redirect authenticated users from public route
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow access for unauthenticated users on public routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
