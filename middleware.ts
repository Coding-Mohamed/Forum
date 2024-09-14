import { clerkMiddleware, createRouteMatcher, AuthObject } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "./convex/_generated/api";
import { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/pages"]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth: AuthObject, req: NextRequest) => {
  if (isProtectedRoute(req) || isAdminRoute(req)) auth().protect();

  if (isAdminRoute(req)) {
    const { userId } = auth();
    try {
      const preloaded = await preloadQuery(api.admins.checkAdmin, { userId });
      const isAdmin = preloadedQueryResult(preloaded);

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.error("Middleware admin check failed", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", "/admin(.*)"],
};
