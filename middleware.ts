import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "./convex/_generated/api";

// Match protected and admin routes
const isProtectedRoute = createRouteMatcher(["/pages"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const user = auth();
  const userId = user?.userId;

  // If it's an admin route, handle admin authorization
  if (isAdminRoute(req)) {
    if (!userId) {
      // If not authenticated, redirect to home page (instead of sign-in page)
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Check if the user is an admin
    try {
      const preloaded = await preloadQuery(api.admins.checkAdmin, { userId });
      const isAdmin = preloadedQueryResult(preloaded);

      if (!isAdmin) {
        // If the user is not an admin, redirect to home page
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.error("Admin check failed:", error);
      // Redirect to home page on error
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect other protected routes (if not admin-related)
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)", "/admin(.*)"],
};
