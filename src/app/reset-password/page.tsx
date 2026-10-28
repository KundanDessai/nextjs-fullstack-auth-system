
"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            toast.error("Reset link is missing or invalid.");
            return;
        }

        if (password.length < 8 || password.length > 72) {
            toast.error("Password must be between 8 and 72 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "/api/users/reset-password",
                { token, password }
            );

            toast.success(response.data.message);
            setSuccess(true);
        } catch (error: any) {
            toast.error(
                error.response?.data?.error ||
                "Unable to reset your password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl sm:p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl">
                    🔐
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Reset password
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    Choose a new password for your account.
                </p>

                {!token ? (
                    <div className="mt-6 space-y-4">
                        <p className="text-sm text-red-400">
                            This reset link is missing its token.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                        >
                            Request a new reset link
                        </Link>
                    </div>
                ) : success ? (
                    <div className="mt-8 space-y-5">
                        <p className="text-sm leading-6 text-emerald-300">
                            Your password has been changed successfully.
                        </p>
                        <button
                            onClick={() => router.push("/login")}
                            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold transition hover:bg-indigo-500"
                        >
                            Continue to login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="mt-8 space-y-5">
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                New password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                maxLength={72}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Confirm new password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                maxLength={72}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Updating password..." : "Update password"}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-sm text-slate-400">
                    <Link
                        href="/login"
                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                    Loading reset form...
                </main>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
