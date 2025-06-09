import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Match frontend public routes
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// ✅ Match all /api routes properly, not just /api
const isPublicApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);

  const isAccessingDashboard = currentUrl.pathname === "/Home";

  // Redirect logged-in user from public pages (optional UX)
  if (userId && isPublicRoute(req) && !isAccessingDashboard) {
    return NextResponse.redirect(new URL("/Home", req.url));
  }

  // ✅ Don't redirect public routes or API requests
  if (!userId && !isPublicRoute(req) && !isPublicApiRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
