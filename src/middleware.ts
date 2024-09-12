import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Danh sách tuyến đường công cộng và bị bỏ qua
const publicRoutes = [
  "/",
  "/api/webhook",
  "/question/",
  "/tags",
  "/tags/",
  "/profile/",
  "/community",
  "/jobs",
];
const ignoredRoutes = ["/api/webhook", "/api/chatgpt"];

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Lấy đường dẫn từ request
  const pathname = request.nextUrl.pathname;

  // Nếu là tuyến đường công cộng hoặc bị bỏ qua, không cần bảo vệ
  if (
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    ignoredRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  // Bảo vệ các tuyến đường còn lại
  const user = await auth();
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

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
