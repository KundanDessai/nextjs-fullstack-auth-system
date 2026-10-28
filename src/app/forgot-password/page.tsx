
"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "/api/users/forgot-password",
                { email }
            );

            toast.success(response.data.message);
            setSubmitted(true);
        } catch (error: any) {
            toast.error(
                error.response?.data?.error ||
                "Unable to process your request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl sm:p-10">
                <Link
                    href="/login"
                    className="mb-8 inline-flex items-center text-sm text-slate-400 transition hover:text-white"
                >
                    ← Back to login
                </Link>

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl">
                    ✉
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Forgot password?
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    No worries. Enter the email associated with your
                    account and we&apos;ll send you a reset link.
                </p>

                {submitted ? (
                    <div
                        className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
                        role="status"
                    >
                        <p className="font-medium text-emerald-300">
                            Check your email
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            If an account exists for that email, a
                            password reset link will arrive shortly.
                        </p>

                        <button
                            onClick={() => setSubmitted(false)}
                            className="mt-4 text-sm font-semibold text-indigo-300 hover:text-indigo-200"
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="mt-8 space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Sending link..." : "Send reset link"}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-sm text-slate-400">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}
