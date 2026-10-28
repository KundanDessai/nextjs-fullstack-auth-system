
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
    _id: string;
    username: string;
    email: string;
}

export default function ProfilePage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    const getUserDetails = useCallback(async () => {
        try {
            setLoading(true);

            const response = await axios.get("/api/users/me");
            setUser(response.data.data);
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.error
                : undefined;

            toast.error(
                typeof message === "string"
                    ? message
                    : "Unable to load profile details."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void getUserDetails();
    }, [getUserDetails]);


    const logout = async () => {
        try {
            setLoggingOut(true);

            await axios.get("/api/users/logout");

            toast.success("Logged out successfully.");

            // Replace the current page and navigate to login.
            router.replace("/login");

            // Refresh the route so Next.js picks up the cleared cookie.
            router.refresh();
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.error
                : undefined;

            toast.error(
                typeof message === "string"
                    ? message
                    : "Unable to log out. Please try again."
            );
        } finally {
            setLoggingOut(false);
        }
    };

    const initials = user?.username?.slice(0, 2).toUpperCase() || "U";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#070816] text-white">
            {/* Background gradients */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />

            {/* Navbar */}
            <header className="relative z-10 border-b border-white/10">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-lg font-bold text-violet-300">
                            N
                        </div>

                        <span className="text-xl font-bold tracking-tight">
                            Next<span className="text-violet-400">Auth</span>
                        </span>
                    </Link>

                    <button
                        onClick={logout}
                        disabled={loggingOut}
                        className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                    >
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </header>

            {/* Profile content */}
            <div className="relative z-10 mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
                <div className="mb-9">
                    <p className="mb-3 text-sm font-medium text-violet-300">
                        YOUR ACCOUNT
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Welcome back
                        {user?.username ? `, ${user.username}` : ""}!
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
                        View your profile information and manage your account.
                    </p>
                </div>

                {/* Profile card */}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/4 shadow-2xl shadow-violet-950/20 backdrop-blur-xl">
                    <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                        <h2 className="text-lg font-semibold">
                            Profile Details
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            Your personal account information.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {loading ? (
                            <div className="space-y-5">
                                <div className="h-16 animate-pulse rounded-xl bg-white/5" />
                                <div className="h-16 animate-pulse rounded-xl bg-white/5" />
                                <div className="h-16 animate-pulse rounded-xl bg-white/5" />
                            </div>
                        ) : user ? (
                            <>
                                {/* Avatar and username */}
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-blue-600 text-xl font-bold shadow-lg shadow-violet-900/20">
                                        {initials}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-xl font-semibold">
                                            {user.username}
                                        </h3>

                                        <p className="mt-1 break-all text-sm text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* User information */}
                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-300">
                                            Username
                                        </label>

                                        <div className="rounded-xl border border-white/10 bg-[#0b0d20] px-4 py-3.5 text-sm text-gray-200">
                                            {user.username}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-300">
                                            Email address
                                        </label>

                                        <div className="break-all rounded-xl border border-white/10 bg-[#0b0d20] px-4 py-3.5 text-sm text-gray-200">
                                            {user.email}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-300">
                                            User ID
                                        </label>

                                        <div className="break-all rounded-xl border border-white/10 bg-[#0b0d20] px-4 py-3.5 font-mono text-xs text-gray-400">
                                            {user._id}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={getUserDetails}
                                    disabled={loading}
                                    className="mt-7 rounded-xl border border-violet-400/20 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-300 transition hover:border-violet-400/40 hover:bg-violet-500/15 disabled:opacity-50"
                                >
                                    Refresh Profile
                                </button>
                            </>
                        ) : (
                            <div className="py-6 text-center">
                                <p className="font-medium text-gray-200">
                                    Could not load your profile.
                                </p>

                                <p className="mt-2 text-sm text-gray-400">
                                    Please try again.
                                </p>

                                <button
                                    onClick={getUserDetails}
                                    className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Subtle account security section */}
                <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/2 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-200">
                            Account Security
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Need to reset your password?
                        </p>
                    </div>

                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-violet-300 transition hover:text-violet-200"
                    >
                        Reset password →
                    </Link>
                </section>

                <footer className="mt-10 text-center text-xs text-gray-600">
                    NextAuth · Built with Next.js and MongoDB
                </footer>
            </div>
        </main>
    );
}
