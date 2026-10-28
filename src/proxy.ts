
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isAuthPage =
        path === "/login" ||
        path === "/signup" ||
        path === "/verifyemail";

    const isPasswordRecoveryPage =
        path === "/forgot-password" ||
        path === "/reset-password";

    const token = request.cookies.get("token")?.value;

    // Logged-in users should not revisit login/signup pages.
    if (isAuthPage && token) {
        return NextResponse.redirect(
            new URL("/profile", request.url)
        );
    }

    // Password recovery must work whether logged in or logged out.
    if (isPasswordRecoveryPage) {
        return NextResponse.next();
    }

    // Protect private pages.
    if (!isAuthPage && !token) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/profile/:path*",
        "/login",
        "/signup",
        "/verifyemail",
        "/forgot-password",
        "/reset-password",
    ],
};
